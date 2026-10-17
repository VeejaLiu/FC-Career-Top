-- Execute the real personalized script in a simulated Live Editor (Lua 5.3+).
local file = assert(io.open(arg[1], 'rb'))
local template = file:read('*a'); file:close()
local secret = 'fct-' .. string.rep('a', 64)
local emitted = {}
local function fixture(version, options)
    options = options or {}
    local sent, logs, handlers = {}, {}, {}
    local now = 2000000000
    local env = setmetatable({}, { __index = _G })
    env._G = env
    env.os = setmetatable({ time = function() return now end }, { __index = os })
    env.print = function(v) logs[#logs + 1] = v end
    env.LE_VERSION = 'v' .. version .. '.1.0'
    env.ENUM_CM_EVENT_MSG_POST_LOAD_PREPARE = 1
    env.ENUM_CM_EVENT_MSG_ENTERED_HUB_FIRST_TIME = 2
    env.ENUM_CM_EVENT_MSG_SCREEN_HAS_DONE_LOADING = 3
    env.ENUM_CM_EVENT_MSG_DAY_PASSED = 4
    env.ENUM_CM_EVENT_MSG_WEEK_PASSED = 5
    env.IsInCM = function() return not options.outsideCareer end
    env.GetUserTeamID = function()
        if options.collectFailure then error(options.collectFailure) end
        return 10
    end
    env.GetCurrentDate = function()
        if options.dateFailure then error('Career date test failure') end
        return { year = 2026, month = 10, day = 13 }
    end
    env.GetPlayerName = function() return 'Fixture Player' end
    env.GetEventHandlers = function() return handlers end
    env.AddEventHandler = function(_, fn) handlers[#handlers + 1] = { id = #handlers + 1, fn = fn } end
    env.RemoveEventHandler = function(_, id)
        for i, handler in ipairs(handlers) do if handler.id == id then table.remove(handlers, i); break end end
    end
    local function tableWith(values)
        local fields = {}
        for name, value in pairs(values) do fields[name] = { GetValue = function() return value end } end
        return {
            fields = fields, GetField = function(_, name) return fields[name] end,
            GetFirstRecord = function() return 1 end, GetNextValidRecord = function() return 0 end,
        }
    end
    local tables = {
        career_playercontract = tableWith({ playerid = 1, teamid = 10 }),
        cm_teamsheets = tableWith({ teamid = 10, playerid0 = 1 }),
        players = tableWith({ playerid = 1, birthdate = 150000, overallrating = 70, potential = 90, preferredposition1 = 25 }),
    }
    env.LE = { db = { GetTable = function(_, name) return tables[name] end } }
    env.require = function(name)
        if name == 'imports/external/json' then
            if options.importFailure then error('JSON module unavailable') end
            return {
                encode = function() if options.encodeFailure then error('Encode failure') end; return '[snapshot]' end,
                decode = function() if options.decodeFailure then error('Decode failure') end; return { success = true } end,
            }
        end
    end
    env.HTTP_POST_REQUEST = 1
    env.REQUEST = { new = function()
        return {
            SetMethod = function() end, SetUrl = function(self, v) self.url = v end,
            SetHeaders = function(self, v) self.headers = v end,
            SetBody = function(self, v) self.body = v end, SetTimeout = function(self, v) self.timeout = v end,
        }
    end }
    local function respond(req)
        sent[#sent + 1] = req
        assert(req.headers['secret-key'] == secret)
        if req.url:find('/lua/errors', 1, true) then
            assert(req.timeout == 2000)
            emitted[#emitted + 1] = req.body
            if options.reportThrows then error('Reporter offline') end
            return { status_code = options.reportStatus or 200, text = 'saved' }
        end
        assert(req.timeout == 10000)
        if options.uploadThrows then error('Snapshot network failure') end
        return { status_code = options.uploadStatus or 200, text = 'saved' }
    end
    env.HTTP = { send = function(_, req) return respond(req) end }
    local files = {}
    if options.curl then
        env.REQUEST, env.HTTP, env.HTTP_POST_REQUEST = nil, nil, nil
        env.os.getenv = function() return 'C:\\Temp' end
        env.os.remove = function(path) files[path] = nil end
        local function configValue(config, name)
            return assert(config:match(name .. ' = "(.-)"')):gsub('\\(.)', '%1')
        end
        env.io = {
            open = function(path, mode)
                if options.curlWriteFailure and mode == 'wb' then return nil, 'Test write failure' end
                if mode == 'rb' and not files[path] then return nil end
                return {
                    write = function(self, value) files[path] = value; return self end,
                    read = function() return files[path] end, close = function() return true end,
                }
            end,
            popen = function(command)
                assert(not command:find(secret, 1, true), 'curl command must not contain credentials')
                local configPath = assert(command:match('curl %-%-config "(.-)"'))
                local config = assert(files[configPath])
                local req = {
                    url = configValue(config, 'url'),
                    body = files[configValue(config, 'data%-binary'):sub(2)],
                    headers = { ['secret-key'] = secret },
                    timeout = assert(tonumber(config:match('max%-time = ([%d.]+)'))) * 1000,
                }
                assert(config:find('secret-key: ' .. secret, 1, true))
                local response = respond(req)
                files[configValue(config, 'output')] = response.text
                return { read = function() return tostring(response.status_code) end, close = function() return true end }
            end,
        }
    end
    local script = template:gsub('{{career%-id}}',options.careerId and tostring(options.careerId) or 'nil'):gsub('{{game%-version}}', tostring(version))
        :gsub('{{user%-secret%-key%-lua}}', function() return string.format('%q', secret) end)
        :gsub('{{post%-player%-url%-lua}}', '"https://api.example.test"')
        :gsub('{{playstyle%-catalog%-lua}}', '{}')
    local run = assert(load(script, '@fc-career-top.lua', 't', env))
    local function reports()
        local result = {}
        for _, req in ipairs(sent) do if req.url:find('/lua/errors', 1, true) then result[#result + 1] = req end end
        return result
    end
    local function event(id) assert(handlers[1]); handlers[1].fn(nil, id, nil) end
    return { env = env, run = run, reports = reports, event = event, logs = logs, sent = sent,
        files = files, tick = function(seconds) now = now + seconds end }
end

for _, version in ipairs({24,25,26,27}) do
    local f = fixture(version); f.run()
    assert(#f.reports() == 0 and #f.sent == 1)
    f.event(5); assert(#f.sent == 1, 'Successful snapshot still deduplicates')
    f.run(); assert(#f.env.FC_CAREER_TOP_TRACKER.handlerIDs == 1)
end
local bound = fixture(27, { careerId = 171 }); bound.run()
assert(bound.sent[1].url:find('&careerId=171', 1, true), 'Script uploads stay bound to the chosen career')
assert(bound.sent[1].url:find('&scriptVersion=2026.10.17.1', 1, true))
assert(bound.sent[1].url:find('&editorVersion=v27.1.0', 1, true))
local boundError=fixture(27, {careerId=171,collectFailure='Bound diagnostic'});boundError.run()
assert(boundError.reports()[1].body:find('"careerId":171',1,true))
local options = { collectFailure = 'fixture secret ' .. secret .. '\nC:\\Users\\private-name\\script.lua https://user:pass@example.test/path?token=private-query' }
local f = fixture(25, options); f.run()
assert(#f.reports() == 1)
assert(f.reports()[1].body:find('"stage":"snapshot.collect"', 1, true))
assert(f.reports()[1].body:find('stack traceback', 1, true))
assert(not f.reports()[1].body:find(secret, 1, true))
assert(not f.reports()[1].body:find('private-name', 1, true))
assert(not f.reports()[1].body:find('private-query', 1, true))
f.event(5); f.run(); assert(#f.reports() == 1, 'Dedupe survives re-executing the script')
f.tick(301); f.event(5); assert(#f.reports() == 2)
options.collectFailure = nil; f.event(5)
assert(f.env.FC_CAREER_TOP_TRACKER.lastBody == '[snapshot]' and not f.env.FC_CAREER_TOP_TRACKER.uploading)
options.dateFailure = true; f.event(4)
assert(f.reports()[3].body:find('"eventId":4', 1, true))

local imported = fixture(26, { importFailure = true }); imported.run()
assert(#imported.reports() == 1 and imported.reports()[1].body:find('initialization.imports', 1, true))
local response = fixture(27, { uploadStatus = 503 }); response.run()
assert(response.reports()[1].body:find('"httpStatus":503', 1, true))
local decode = fixture(24, { decodeFailure = true }); decode.run(); assert(#decode.reports() == 1)
local encode = fixture(25, { encodeFailure = true }); encode.run()
assert(encode.reports()[1].body:find('snapshot.encode', 1, true))
local network = fixture(25, { uploadThrows = true }); network.run()
assert(network.reports()[1].body:find('snapshot.upload', 1, true))
local offlineOptions = { collectFailure = 'Collect error', reportThrows = true }
local offline = fixture(25, offlineOptions); offline.run()
offlineOptions.collectFailure = 'Different error'; offline.event(5)
assert(#offline.reports() == 1 and not offline.env.FC_CAREER_TOP_TRACKER.uploading, 'No recursive reporting')
offlineOptions.collectFailure = nil; offline.event(5)
assert(offline.env.FC_CAREER_TOP_TRACKER.lastBody == '[snapshot]', 'Upload recovers despite diagnostic failure')
local cappedOptions = { collectFailure = 'Error 1' }
local capped = fixture(25, cappedOptions); capped.run()
for i = 2, 30 do cappedOptions.collectFailure = 'Error ' .. i; capped.event(5) end
assert(#capped.reports() == 20, 'Hourly cap')
local outside = fixture(25, { outsideCareer = true }); outside.run(); assert(#outside.sent == 0)
local unicode = fixture(26, { collectFailure = string.rep('球', 2000) }); unicode.run()
assert(utf8.len(unicode.reports()[1].body), 'Truncation preserves UTF-8')
local noDebug = fixture(25, { collectFailure = 'No debug library' }); noDebug.env.debug = false; noDebug.run()
assert(#noDebug.reports() == 1)
local curl = fixture(24, { curl = true, uploadStatus = 503 }); curl.run()
assert(#curl.reports() == 1 and next(curl.files) == nil, 'curl diagnostics clean temporary files')
local curlOK = fixture(25, { curl = true }); curlOK.run()
assert(#curlOK.reports() == 0 and curlOK.env.FC_CAREER_TOP_TRACKER.lastBody == '[snapshot]')
assert(next(curlOK.files) == nil)
local curlWrite = fixture(25, { curl = true, curlWriteFailure = true }); curlWrite.run()
assert(not curlWrite.env.FC_CAREER_TOP_TRACKER.uploading and next(curlWrite.files) == nil)
for _, payload in ipairs(emitted) do io.write(payload, '\n') end
