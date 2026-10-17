-- FC Career Top: complete squad snapshots for FC 24, 25, 26 and 27.
-- Copy the personalized script from Get Started; keep its API key private.
-- Runtime errors are automatically reported for maintenance (no squad/save payload).
local GAME_VERSION = {{game-version}}
local SECRET_KEY = {{user-secret-key-lua}}
local API_URL = {{post-player-url-lua}}
local CAREER_ID = {{career-id}}
local SCRIPT_VERSION = '2026.10.17.1'
local UPLOAD_URL = API_URL .. '/api/v1/player/bulk?gameVersion=' .. GAME_VERSION .. '&scriptVersion=' .. SCRIPT_VERSION
    .. (CAREER_ID and ('&careerId=' .. CAREER_ID) or '')
local ERROR_URL = API_URL .. '/api/v1/lua/errors'
local EVENT_NAME = 'post__CareerModeEvent'
local STATE_KEY = 'FC_CAREER_TOP_TRACKER'
local HTTP_TIMEOUT_MS = 10000
local ERROR_TIMEOUT_MS = 2000

local function safeText(value, limit)
    local text = tostring(value)
    local pattern = SECRET_KEY:gsub('([^%w])', '%%%1')
    text = text:gsub(pattern, '[redacted]')
    text = text:gsub('fc[td]%-[%da-fA-F]+', '[redacted]')
    text = text:gsub('[Tt][Oo][Kk][Ee][Nn]["\']?%s*[=:]%s*["\']?[^%s,;"\']+', 'token=[redacted]')
    text = text:gsub('[Pp][Aa][Ss][Ss][Ww][Oo][Rr][Dd]["\']?%s*[=:]%s*["\']?[^%s,;"\']+', 'password=[redacted]')
    text = text:gsub('[Aa][Uu][Tt][Hh][Oo][Rr][Ii][Zz][Aa][Tt][Ii][Oo][Nn]%s*:%s*[^\r\n]+', 'authorization: [redacted]')
    text = text:gsub('[%w._+%-]+@[%w.%-]+', '[email]')
    text = text:gsub('([A-Za-z]:[/\\]Users[/\\])[^/\\\r\n]+', '%1[user]')
    text = text:gsub('(/Users/)[^/\r\n]+', '%1[user]'):gsub('(/home/)[^/\r\n]+', '%1[user]')
    -- Never transmit URL credentials, query parameters or fragments.
    text = text:gsub('https?://[^%s<>"\']+', function(url)
        return (url:gsub('^(https?://)[^/]*@', '%1'):gsub('[?#].*$', ''))
    end)
    if #text > limit then
        text = text:sub(1, limit):gsub('[\194-\244][\128-\191]*$', '')
    end
    return text
end

local function log(message)
    -- Never print credentials, request headers, or the personalized script.
    pcall(print, '[FC Career Top] ' .. safeText(message, 2000))
end

local function captureError(message)
    local text = safeText(message, 1000)
    local trace = text
    if debug and type(debug.traceback) == 'function' then
        trace = safeText(debug.traceback(text, 2), 4000)
    end
    return { message = text, traceback = trace }
end

local function hasNativeHTTP()
    return REQUEST ~= nil and type(REQUEST.new) == 'function'
        and HTTP ~= nil and type(HTTP.send) == 'function'
        and HTTP_POST_REQUEST ~= nil
end

local function postNative(url, body, timeout)
    local req = REQUEST:new()
    req:SetMethod(HTTP_POST_REQUEST)
    req:SetUrl(url)
    req:SetHeaders({ ['Content-Type'] = 'application/json', ['secret-key'] = SECRET_KEY })
    req:SetBody(body)
    req:SetTimeout(timeout)
    local response = HTTP:send(req)
    if not response or (response.error and response.error ~= '') then
        error('Network request failed: ' .. tostring(response and response.error or 'no response'))
    end
    return tonumber(response.status_code) or 0, response.text
end

local function postCurl(url, body, timeout)
    local directory = os.getenv('TEMP') or os.getenv('TMP') or '.'
    if directory:find('[%%!"\r\n]') then error('Temporary directory cannot be used safely by curl') end
    local base = directory .. '/fc_career_top_' .. GAME_VERSION .. '_' .. os.time() .. '_' .. math.random(100000, 999999)
    local dataPath, configPath, responsePath = base .. '.json', base .. '.cfg', base .. '.response'
    local function cleanup()
        os.remove(dataPath); os.remove(configPath); os.remove(responsePath)
    end
    local function writeFile(path, value)
        local file, message = io.open(path, 'wb')
        if not file then error('Cannot create upload file: ' .. tostring(message)) end
        local written, failure = file:write(value)
        local closed, closeFailure = file:close()
        if not written or not closed then error('Cannot write upload file: ' .. tostring(failure or closeFailure)) end
    end
    local function curlValue(value)
        return '"' .. value:gsub('\\', '\\\\'):gsub('"', '\\"'):gsub('\r', '\\r'):gsub('\n', '\\n') .. '"'
    end
    local ok, status, response = pcall(function()
        writeFile(dataPath, body)
        writeFile(configPath, table.concat({
            'request = "POST"', 'url = ' .. curlValue(url),
            'header = "Content-Type: application/json"',
            'header = ' .. curlValue('secret-key: ' .. SECRET_KEY),
            'data-binary = ' .. curlValue('@' .. dataPath),
            'output = ' .. curlValue(responsePath), 'write-out = "%{http_code}"',
            'connect-timeout = ' .. math.min(5, timeout / 1000), 'max-time = ' .. (timeout / 1000), 'silent',
        }, '\n'))
        -- Credentials live in the temporary config, never the command/log output.
        local pipe = io.popen('curl --config "' .. configPath .. '" 2>NUL', 'r')
        if not pipe then error('Cannot start Windows curl') end
        local status = tonumber(pipe:read('*a')) or 0
        pipe:close()
        local file = io.open(responsePath, 'rb')
        local response = file and file:read('*a') or ''
        if file then file:close() end
        return status, response
    end)
    cleanup()
    if not ok then error(status) end
    return status, response
end

local function post(url, body, timeout)
    if hasNativeHTTP() then return postNative(url, body, timeout) end
    return postCurl(url, body, timeout)
end

-- Independent of Live Editor's JSON module: import failures can be reported too.
local function diagnosticJSON(fields)
    local function quote(value)
        return '"' .. value:gsub('[%z\1-\31\\"]', function(char)
            if char == '\\' or char == '"' then return '\\' .. char end
            return string.format('\\u%04x', char:byte())
        end) .. '"'
    end
    local parts = {}
    for key, value in pairs(fields) do
        parts[#parts + 1] = quote(key) .. ':' .. (type(value) == 'number' and tostring(value) or quote(value))
    end
    return '{' .. table.concat(parts, ',') .. '}'
end

local reportState = rawget(_G, 'FC_CAREER_TOP_DIAGNOSTICS')
if type(reportState) ~= 'table' then
    reportState = { count = 0, seen = {}, window = 0, cooldown = 0 }
    rawset(_G, 'FC_CAREER_TOP_DIAGNOSTICS', reportState)
end
local currentStage = 'initialization.imports'
local trackerState
local function reportError(stage, failure, context)
    -- Reporting has its own guard and never calls the tracker or itself on failure.
    local ok = pcall(function()
        if reportState.reporting then return end
        local now = os.time()
        if now - reportState.window >= 3600 then
            reportState.count, reportState.seen, reportState.window = 0, {}, now
        end
        local info = type(failure) == 'table' and failure or captureError(failure)
        local message = safeText(info.message, 1000)
        local signature = stage .. ':' .. message
        if reportState.count >= 20 or now < reportState.cooldown
            or (reportState.seen[signature] and now - reportState.seen[signature] < 300) then return end
        reportState.seen[signature] = now
        reportState.count = reportState.count + 1
        local fields = {
            gameVersion = GAME_VERSION, careerId = CAREER_ID, scriptVersion = SCRIPT_VERSION,
            editorVersion = safeText(LE_VERSION or 'unknown', 80), stage = stage,
            message = message, traceback = safeText(info.traceback or message, 4000),
        }
        for _, name in ipairs({ 'eventId', 'httpStatus' }) do
            local value = context and context[name]
            if type(value) == 'number' and value >= 0 and value % 1 == 0 then fields[name] = value end
        end
        if trackerState and trackerState.currentDate then
            local date = trackerState.currentDate
            fields.careerDate = string.format('%04d-%02d-%02d', date.year, date.month, date.day)
        end
        reportState.reporting = true
        local sent, status = pcall(post, ERROR_URL, diagnosticJSON(fields), ERROR_TIMEOUT_MS)
        reportState.reporting = false
        if not sent or not status or status < 200 or status >= 300 then
            -- A server/network failure suppresses all further reporting for 5 minutes.
            reportState.cooldown = now + 300
            log('Error report could not be sent; the original error remains in the local log.')
        end
    end)
    reportState.reporting = false
    if not ok then log('Error report unavailable; the original error remains in the local log.') end
end

local function startTracker()
require 'imports/career_mode/helpers'
require 'imports/other/helpers'
local json = require 'imports/external/json'
pcall(require, 'imports/other/playstyles_enum')
currentStage = 'initialization.setup'

local editorYear = tonumber(tostring(LE_VERSION):match('^v?(%d+)%.'))
if editorYear and editorYear >= 24 and editorYear <= 27 and editorYear ~= GAME_VERSION then
    log('This script is for FC ' .. GAME_VERSION .. ', but the running editor is for FC ' .. editorYear
        .. '. Select the matching game version in Get Started and copy the script again.')
    return
end

if not IsInCM() then
    log('Load your Manager Career Mode save, then execute this script again.')
    return
end

local previous = rawget(_G, STATE_KEY)
if type(previous) == 'table' then
    previous.active = false
    for _, id in ipairs(previous.handlerIDs or {}) do
        pcall(RemoveEventHandler, EVENT_NAME, id)
    end
end

local state = { active = true, handlerIDs = {}, uploading = false }
trackerState = state
rawset(_G, STATE_KEY, state)

local attributes = {
    'birthdate', 'overallrating', 'potential', 'nationality', 'height', 'weight',
    'preferredfoot', 'preferredposition1', 'preferredposition2', 'preferredposition3',
    'preferredposition4', 'preferredposition5', 'preferredposition6', 'preferredposition7',
    'skillmoves', 'weakfootabilitytypecode', 'acceleration', 'sprintspeed',
    'positioning', 'finishing', 'shotpower', 'longshots', 'volleys', 'penalties',
    'vision', 'crossing', 'freekickaccuracy', 'shortpassing', 'longpassing', 'curve',
    'agility', 'balance', 'reactions', 'ballcontrol', 'dribbling', 'composure',
    'interceptions', 'headingaccuracy', 'defensiveawareness', 'standingtackle',
    'slidingtackle', 'jumping', 'stamina', 'strength', 'aggression',
    'gkdiving', 'gkhandling', 'gkkicking', 'gkpositioning', 'gkreflexes',
}
if GAME_VERSION == 24 then
    attributes[#attributes + 1] = 'attackingworkrate'
    attributes[#attributes + 1] = 'defensiveworkrate'
end

local function getTable(name)
    local tbl = LE.db:GetTable(name)
    if not tbl then error('Database table unavailable: ' .. name) end
    return tbl
end

local function getFields(tbl, names)
    local fields = {}
    for _, name in ipairs(names) do
        local field = tbl:GetField(name)
        if field then fields[name] = field end
    end
    return fields
end

local function readField(tbl, fields, record, name)
    local field = fields[name]
    if not field then return nil end
    if type(field.GetValue) == 'function' then return field:GetValue(record) end
    return tbl:GetRecordFieldValue(record, name)
end

local function validPlayerID(id)
    return type(id) == 'number' and id > 0 and id < 4294967295 and id % 1 == 0
end

local function countIDs(ids)
    local count = 0
    for _ in pairs(ids) do count = count + 1 end
    return count
end

local function getRoster(teamID)
    -- Newer editors use team sheets. Include index zero, which some helper
    -- versions omit. Read every available slot instead of assuming its count.
    if GAME_VERSION >= 26 then
        local ok, ids = pcall(function()
            local tbl = getTable('cm_teamsheets')
            local teamField = tbl:GetField('teamid')
            if not teamField then return nil end
            local names = {}
            for name in pairs(tbl.fields or {}) do
                if type(name) == 'string' and name:match('^playerid%d+$') then
                    names[#names + 1] = name
                end
            end
            if #names == 0 then
                for i = 0, 51 do names[#names + 1] = 'playerid' .. i end
            end
            local fields = getFields(tbl, names)
            fields.teamid = teamField
            local result = {}
            local record = tbl:GetFirstRecord()
            while record > 0 do
                if readField(tbl, fields, record, 'teamid') == teamID then
                    for _, name in ipairs(names) do
                        local id = readField(tbl, fields, record, name)
                        if validPlayerID(id) then result[id] = true end
                    end
                end
                record = tbl:GetNextValidRecord()
            end
            return countIDs(result) > 0 and result or nil
        end)
        if ok and ids then return ids end
    end

    local tbl = getTable('career_playercontract')
    local fields = getFields(tbl, { 'teamid', 'playerid' })
    if not fields.teamid or not fields.playerid then error('Contract roster fields unavailable') end
    local result = {}
    local record = tbl:GetFirstRecord()
    while record > 0 do
        if readField(tbl, fields, record, 'teamid') == teamID then
            local id = readField(tbl, fields, record, 'playerid')
            if validPlayerID(id) then result[id] = true end
        end
        record = tbl:GetNextValidRecord()
    end
    return result
end

local function readDate()
    local date = GetCurrentDate()
    if not date or type(date.year) ~= 'number' or type(date.month) ~= 'number'
        or type(date.day) ~= 'number' or date.year < 1900
        or date.month < 1 or date.month > 12 or date.day < 1 or date.day > 31 then
        error('Career date unavailable')
    end
    return { year = date.year, month = date.month, day = date.day }
end

local function dateKey(date)
    return string.format('%04d-%02d-%02d', date.year, date.month, date.day)
end

local function resetDate()
    state.currentDate = readDate()
    state.rawDateKey = dateKey(state.currentDate)
end

local function advanceDate()
    local current = readDate()
    local key = dateKey(current)
    if GAME_VERSION ~= 24 or not state.currentDate or key ~= state.rawDateKey then
        state.currentDate = current
    else
        -- Preserve FC 24's calendar workaround without system timezone/DST math.
        local date = state.currentDate
        local leap = date.year % 4 == 0 and (date.year % 100 ~= 0 or date.year % 400 == 0)
        local days = { 31, leap and 29 or 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 }
        date.day = date.day + 1
        if date.day > days[date.month] then
            date.day = 1
            date.month = date.month + 1
            if date.month > 12 then date.month = 1; date.year = date.year + 1 end
        end
    end
    state.rawDateKey = key
end

local STYLE_CATALOG = {{playstyle-catalog-lua}}
local styles, layoutWidth
local runtimeStyles = {}
local styleAliases = {
    GK_FAR_THROW = 'Far_Throw', GK_FOOTWORK = 'Footwork',
    GK_CROSS_CLAIMER = 'Cross_Claimer',
    GK_RUSH_OUT = GAME_VERSION == 25 and '1v1_Close_Down' or 'Rush_Out',
    GK_FAR_REACH = 'Far_Reach',
    GK_QUICK_REFLEXES = GAME_VERSION == 24 and 'Quick_Reflexes' or 'Deflector',
    CPUAI_LONG_SHOT_TAKER = 'Long_Shot_Taker_CPU',
    CPUAI_EARLY_CROSSER = 'Early_Crosser_CPU',
    CAREER_SOLID_PLAYER = 'Solid_Player', CAREER_TEAM_PLAYER = 'Team_Player',
    CAREER_ONE_CLUB_PLAYER = 'One_Club_Player', CAREER_INJURY_PRONE = 'Injury_Prone',
    CAREER_LEADERSHIP = 'Leadership', LOWDRIVEN_SHOT = 'Low_Driven_Shot',
    LOW_DRIVEN_SHOT = 'Low_Driven_Shot', GAME_CHANGER = 'Gamechanger',
}
-- Packaged enums can lag behind the game. Only trust a family whose known
-- Technical bit agrees with this year's layout; raw masks are always retained.
local enumCompatible = ENUM_PLAYSTYLE1_TECHNICAL == (GAME_VERSION >= 26 and 1048576 or 65536)
if enumCompatible then
    for key, mask in pairs(_G) do
        local group, name
        if type(key) == 'string' then group, name = key:match('^ENUM_PLAYSTYLE([12])_(.+)$') end
        if group and type(mask) == 'number' and math.type(mask) == 'integer'
            and mask > 0 and (mask & (mask - 1)) == 0 then
            local id = styleAliases[name] or name:lower():gsub('(%a)([%w]*)', function(first, rest)
                return first:upper() .. rest
            end)
            local kind = (name:match('^CPUAI_') or name:match('^CAREER_')) and 'trait' or 'playstyle'
            runtimeStyles[#runtimeStyles + 1] = { id = id, kind = kind, group = tonumber(group), mask = mask }
        end
    end
end

local function getStyleLayout(fields)
    local description = fields.trait1 and fields.trait1.fld_desc
    local split = description and description.depth
    if type(split) ~= 'number' or split < 1 or split > 63 then
        if not enumCompatible then return nil end
        split = GAME_VERSION >= 26 and 32 or 30
    end
    if styles and layoutWidth == split then return styles end
    styles, layoutWidth = { {}, {} }, split
    local referenceSplit = GAME_VERSION >= 26 and 32 or 30
    for _, feature in ipairs(STYLE_CATALOG) do
        -- SoFIFA uses a combined mask. Split it using the editor's actual field
        -- width instead of assuming every game packs trait1/trait2 identically.
        local position = feature.bit + (feature.group == 2 and referenceSplit or 0)
        local group = position < split and 1 or 2
        local bit = position < split and position or position - split
        styles[group][1 << bit] = feature
    end
    for _, feature in ipairs(runtimeStyles) do
        -- Compatible native enums are authoritative for their own identifiers.
        for group = 1, 2 do
            for mask, candidate in pairs(styles[group]) do
                if candidate.id == feature.id then styles[group][mask] = nil end
            end
        end
        styles[feature.group][feature.mask] = feature
    end
    return styles
end

local function getPlayStyles(tbl, fields, record)
    if not fields.trait1 or not fields.trait2 or not fields.icontrait1 or not fields.icontrait2 then
        return nil, nil, nil
    end
    local layout = getStyleLayout(fields)
    if not layout then return nil, nil, nil end
    local result, traits, unknown = {}, {}, {}
    for group = 1, 2 do
        local normal = readField(tbl, fields, record, 'trait' .. group)
        local enhanced = readField(tbl, fields, record, 'icontrait' .. group)
        if type(normal) ~= 'number' or type(enhanced) ~= 'number' then return nil, nil, nil end
        local known = 0
        for mask, feature in pairs(layout[group]) do
            known = known | mask
            if feature.kind == 'trait' then
                if ((normal | enhanced) & mask) ~= 0 then traits[#traits + 1] = feature.id end
            elseif (enhanced & mask) ~= 0 then result[#result + 1] = feature.id .. '_'
            elseif (normal & mask) ~= 0 then result[#result + 1] = feature.id end
        end
        local depth = fields['trait' .. group].fld_desc and fields['trait' .. group].fld_desc.depth
        if type(depth) == 'number' and depth > 0 and depth < 64 then
            normal = normal & ((1 << depth) - 1)
            enhanced = enhanced & ((1 << depth) - 1)
        end
        if (normal & ~known) ~= 0 then unknown['trait' .. group] = string.format('0x%X', normal & ~known) end
        if (enhanced & ~known) ~= 0 then unknown['icontrait' .. group] = string.format('0x%X', enhanced & ~known) end
    end
    table.sort(result)
    table.sort(traits)
    return result, traits, next(unknown) and unknown or nil
end

local function allFields(tbl)
    local fields = {}
    for name, field in pairs(tbl.fields or {}) do
        if type(name) == 'string' and name:match('^[%w_]+$') then fields[name] = field end
    end
    return fields
end

local function recordData(tbl, fields, record)
    local result, unreadable = {}, {}
    for name in pairs(fields) do
        local ok, value = pcall(readField, tbl, fields, record, name)
        if ok and (type(value) == 'string' or type(value) == 'boolean') then result[name] = value
        elseif ok and type(value) == 'number' and value == value and math.abs(value) < math.huge then
            -- JSON/JavaScript cannot preserve integers above 2^53 exactly.
            result[name] = math.abs(value) > 9007199254740991 and tostring(value) or value
        else unreadable[#unreadable + 1] = name end
    end
    table.sort(unreadable)
    return result, unreadable
end

local function collectRelatedData(ids)
    local names, seen = { 'career_playercontract', 'teamplayerlinks' }, {
        career_playercontract = true, teamplayerlinks = true,
    }
    local ok, available
    if type(GetDBTablesNames) == 'function' then ok, available = pcall(GetDBTablesNames) end
    if not ok or type(available) ~= 'table' then
        available = LE.db.meta and LE.db.meta.shortname_name_tables_map or {}
    end
    for _, name in pairs(available) do
        if type(name) == 'string' and not seen[name] and name:match('^career_')
            and (name:find('player') or name:find('contract') or name:find('injur')
                or name:find('growth') or name:find('develop') or name:find('morale')
                or name:find('fitness') or name:find('form')) then
            names[#names + 1] = name
            seen[name] = true
        end
    end
    table.sort(names)
    local result, availability, teamNames = {}, {}, {}
    for _, name in ipairs(names) do
        local success, data = pcall(function()
            local tbl = getTable(name)
            local fields = allFields(tbl)
            local idField = fields.playerid and 'playerid' or (fields.player_id and 'player_id')
            if not idField then return nil end
            local rows = {}
            local record = tbl:GetFirstRecord()
            while record > 0 do
                local id = readField(tbl, fields, record, idField)
                if ids[id] then
                    rows[id] = rows[id] or {}
                    -- Keep the entire readable row, including unfamiliar new fields.
                    local row = recordData(tbl, fields, record)
                    if type(row.teamid) == 'number' and row.teamid > 0 and type(GetTeamName) == 'function' then
                        if teamNames[row.teamid] == nil then
                            local found, teamName = pcall(GetTeamName, row.teamid)
                            teamNames[row.teamid] = found and type(teamName) == 'string' and teamName or false
                        end
                        row.teamName = teamNames[row.teamid] or nil
                    end
                    rows[id][#rows[id] + 1] = row
                end
                record = tbl:GetNextValidRecord()
            end
            return rows
        end)
        availability[name] = success and data ~= nil
        if success and data then
            for id in pairs(ids) do
                result[id] = result[id] or {}
                result[id][name] = data[id] or {}
            end
        end
    end
    return result, availability
end

local function collectSeasonStats(ids)
    if type(GetPlayersStats) ~= 'function' then return {}, false end
    local ok, stats = pcall(GetPlayersStats)
    if not ok or type(stats) ~= 'table' then return {}, false end
    local result, competitions = {}, {}
    for _, source in ipairs(stats) do
        if type(source) == 'table' and ids[source.playerid] then
            local row = {}
            for key, value in pairs(source) do
                if type(key) == 'string' and key:match('^[%w_]+$')
                    and (type(value) == 'string' or type(value) == 'boolean'
                        or (type(value) == 'number' and value == value and math.abs(value) <= 9007199254740991)) then
                    row[key] = value
                end
            end
            local compID = row.compobjid
            if compID and not row.compname and type(GetCompetitionNameByObjID) == 'function' then
                if competitions[compID] == nil then
                    local success, name = pcall(GetCompetitionNameByObjID, compID)
                    competitions[compID] = success and type(name) == 'string' and name or false
                end
                row.compname = competitions[compID] or nil
            end
            if type(row.app) == 'number' and row.app > 0 and type(row.avg) == 'number' then
                row.averageRating = row.avg / row.app / 10
            end
            result[source.playerid] = result[source.playerid] or {}
            result[source.playerid][#result[source.playerid] + 1] = row
        end
    end
    return result, true
end

local function collectPlayers()
    if not IsInCM() then return nil end
    local teamID = GetUserTeamID()
    if not teamID or teamID <= 0 then error('Manager team unavailable') end
    local ids = getRoster(teamID)
    local expected = countIDs(ids)
    if expected < 1 or expected > 200 then error('Roster must contain 1-200 players') end
    local date = GAME_VERSION == 24 and state.currentDate or readDate()
    if not date then date = readDate() end
    local names = { 'playerid', 'trait1', 'trait2', 'icontrait1', 'icontrait2' }
    for _, name in ipairs(attributes) do names[#names + 1] = name end
    local tbl = getTable('players')
    local fields = getFields(tbl, names)
    local rawFields = allFields(tbl)
    local fullPlayerFields = next(rawFields) ~= nil
    if not fullPlayerFields then rawFields = fields end
    local related, relatedAvailability = collectRelatedData(ids)
    local seasonStats, statsAvailable = collectSeasonStats(ids)
    local roleFields = false
    for name in pairs(rawFields) do
        if name:match('^role%d+$') then roleFields = true end
    end
    for _, name in ipairs({ 'playerid', 'birthdate', 'overallrating', 'potential', 'preferredposition1' }) do
        if not fields[name] then error('Required player field unavailable: ' .. name) end
    end
    local result, found = {}, {}
    local record = tbl:GetFirstRecord()
    while record > 0 do
        local id = readField(tbl, fields, record, 'playerid')
        if ids[id] and not found[id] then
            local name = GetPlayerName(id)
            if type(name) ~= 'string' or name == '' then error('Name unavailable for player ' .. id) end
            local player = { playerID = id, playerName = name, currentDate = dateKey(date) }
            for _, attr in ipairs(attributes) do
                player[attr] = readField(tbl, fields, record, attr)
            end
            for _, attr in ipairs({ 'birthdate', 'overallrating', 'potential', 'preferredposition1' }) do
                if type(player[attr]) ~= 'number' then
                    error('Required value unavailable for player ' .. id .. ': ' .. attr)
                end
            end
            local traits, unknown
            player.playerStyles, traits, unknown = getPlayStyles(tbl, fields, record)
            local raw, unreadable = recordData(tbl, rawFields, record)
            player.profileData = {
                schemaVersion = 1, gameVersion = GAME_VERSION,
                liveEditorVersion = tostring(LE_VERSION), observedOn = dateKey(date),
                player = raw, related = related[id], seasonStats = seasonStats[id] or {},
                traits = traits, unknownPlayStyleBits = unknown, unreadableFields = unreadable,
                availability = {
                    playerFields = true, fullPlayerFields = fullPlayerFields, relatedTables = relatedAvailability,
                    seasonStats = statsAvailable, roles = roleFields,
                    playStyles = player.playerStyles ~= nil,
                },
            }
            result[#result + 1] = player
            found[id] = true
            if #result == expected then break end
        end
        record = tbl:GetNextValidRecord()
    end
    if #result ~= expected then
        error(string.format('Incomplete roster (%d/%d); upload skipped', #result, expected))
    end
    table.sort(result, function(a, b) return a.playerID < b.playerID end)
    return result
end

local function responseSucceeded(status, body)
    local ok, data = pcall(json.decode, body or '')
    local detail = ok and type(data) == 'table' and type(data.message) == 'string'
        and (': ' .. safeText(data.message, 700)) or ''
    if status < 200 or status >= 300 then
        error('Upload failed (HTTP ' .. status .. ')' .. detail)
    end
    if not ok or type(data) ~= 'table' or data.success ~= true then
        error('Server did not confirm that the snapshot was saved' .. detail)
    end
    return true
end

local function sendSnapshot()
    if not state.active or rawget(_G, STATE_KEY) ~= state or state.uploading then return end
    state.uploading = true
    local stage, context = 'snapshot.collect', {}
    local ok, failure = xpcall(function()
        local players = collectPlayers()
        if not players then return end
        stage = 'snapshot.encode'
        local body = json.encode(players)
        if #body > 1024 * 1024 then error('Complete snapshot exceeds the 1 MB upload limit') end
        if state.lastBody == body then return end
        stage = 'snapshot.upload'
        local editor = tostring(LE_VERSION or 'unknown'):sub(1,80):gsub('[^%w._-]', '')
        local status, response = post(UPLOAD_URL .. '&editorVersion=' .. editor, body, HTTP_TIMEOUT_MS)
        context.httpStatus = status
        stage = 'snapshot.response'
        if responseSucceeded(status, response) then
            state.lastBody = body
            log(string.format('Saved %d players for FC %d on %s.', #players, GAME_VERSION, players[1].currentDate))
        end
    end, captureError)
    state.uploading = false
    if not ok then
        log('Snapshot skipped: ' .. failure.message)
        reportError(stage, failure, context)
    end
end

local function onEvent(eventsManager, eventID, event)
    if not state.active or rawget(_G, STATE_KEY) ~= state then return end
    local ok, failure = xpcall(function()
        if not IsInCM() then return end
        if eventID == ENUM_CM_EVENT_MSG_POST_LOAD_PREPARE then
            state.currentDate = nil
            state.rawDateKey = nil
            state.lastBody = nil
            state.pendingLoad = true
        elseif eventID == ENUM_CM_EVENT_MSG_ENTERED_HUB_FIRST_TIME
            or (state.pendingLoad and eventID == ENUM_CM_EVENT_MSG_SCREEN_HAS_DONE_LOADING) then
            resetDate()
            state.pendingLoad = false
            sendSnapshot()
        elseif eventID == ENUM_CM_EVENT_MSG_DAY_PASSED then
            advanceDate()
        elseif eventID == ENUM_CM_EVENT_MSG_WEEK_PASSED then
            sendSnapshot()
        end
    end, captureError)
    if not ok then
        log('Career event skipped: ' .. failure.message)
        reportError('career.event', failure, { eventId = eventID })
    end
end

currentStage = 'initialization.register'
-- AddEventHandler returns no ID. Compare the handler lists to remember our own.
local before = {}
for _, handler in ipairs(GetEventHandlers(EVENT_NAME)) do before[handler.id] = true end
AddEventHandler(EVENT_NAME, onEvent)
for _, handler in ipairs(GetEventHandlers(EVENT_NAME)) do
    if not before[handler.id] then state.handlerIDs[#state.handlerIDs + 1] = handler.id end
end
local ok, failure = xpcall(resetDate, captureError)
if not ok then
    log(failure.message)
    reportError('initialization.date', failure)
end
log('FC ' .. GAME_VERSION .. ' tracker ready; Live Editor ' .. tostring(LE_VERSION)
    .. (hasNativeHTTP() and '; native HTTP.' or '; Windows curl fallback.'))
sendSnapshot()
end

local ok, failure = xpcall(startTracker, captureError)
if not ok then
    if trackerState then
        trackerState.active = false
        for _, id in ipairs(trackerState.handlerIDs) do pcall(RemoveEventHandler, EVENT_NAME, id) end
    end
    log('Tracker initialization failed: ' .. failure.message)
    reportError(currentStage, failure)
end
