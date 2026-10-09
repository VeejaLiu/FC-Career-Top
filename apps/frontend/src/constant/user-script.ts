export const luaScript_FC24 = `
require 'imports/career_mode/helpers'
require 'imports/other/helpers'
local json = require("imports/external/json")

local pre_cm_event_handlers = GetEventHandlers("pre__CareerModeEvent")
local post_cm_event_handlers = GetEventHandlers("post__CareerModeEvent")

print(string.format("You have %d pre__CareerModeEvents and %d post__CareerModeEvents", #pre_cm_event_handlers, #post_cm_event_handlers))

if #pre_cm_event_handlers > 0 then
    for i, handler in ipairs(pre_cm_event_handlers) do
        RemoveEventHandler("pre__CareerModeEvent", handler.id)
    end
end

if #post_cm_event_handlers > 0 then
    for i, handler in ipairs(post_cm_event_handlers) do
        RemoveEventHandler("post__CareerModeEvent", handler.id)
    end
end

pre_cm_event_handlers = GetEventHandlers("pre__CareerModeEvent")
post_cm_event_handlers = GetEventHandlers("post__CareerModeEvent")

print(string.format("You have %d pre__CareerModeEvents and %d post__CareerModeEvents", #pre_cm_event_handlers, #post_cm_event_handlers))

local currentDate = GetCurrentDate()

local systemDateYear = currentDate.year
local systemDateMonth = currentDate.month
local systemDateDay = currentDate.day

local currentDateYear = currentDate.year
local currentDateMonth = currentDate.month
local currentDateDay = currentDate.day
print(string.format("Init Current Date: %d-%d-%d", currentDateYear, currentDateMonth, currentDateDay))

function addOneDay()
    local time_table = {
        year = currentDateYear,
        month = currentDateMonth,
        day = currentDateDay,
        hour = 0,
        min = 0,
        sec = 0
    }

    local timestamp = os.time(time_table)

    local new_timestamp = timestamp + 24 * 60 * 60

    local new_time_table = os.date("*t", new_timestamp)
    y, m, d = new_time_table.year, new_time_table.month, new_time_table.day
    currentDateYear = y
    currentDateMonth = m
    currentDateDay = d
end

function updateDateWhenDayPass()
    local currentDate = GetCurrentDate()
    Log(string.format("[updateDateWhenDayPass] Get from GetCurrentDate function: %d-%d-%d", currentDate.year, currentDate.month, currentDate.day))
    Log(string.format("[updateDateWhenDayPass] Get from systemDate: %d-%d-%d", systemDateYear, systemDateMonth, systemDateDay))
    Log(string.format("[updateDateWhenDayPass] Get from our currentDate: %d-%d-%d", currentDateYear, currentDateMonth, currentDateDay))
    if (currentDate.year == systemDateYear
            and currentDate.month == systemDateMonth
            and currentDate.day == systemDateDay
    ) then
        Log("[updateDateWhenDayPass] System Date is not updated, add one day")
        addOneDay()
        local dateStr = string.format("%d-%d-%d", currentDateYear, currentDateMonth, currentDateDay)
        print(string.format("[updateDateWhenDayPass] Final Current Date: %s", dateStr))
        return
    end

    Log("System Date is updated, so we can use it directly")
    systemDateYear = currentDate.year
    systemDateMonth = currentDate.month
    systemDateDay = currentDate.day
    currentDateYear = currentDate.year
    currentDateMonth = currentDate.month
    currentDateDay = currentDate.day

    local dateStr = string.format("%d-%d-%d", currentDate.year, currentDate.month, currentDate.day)
    Log(string.format("[updateDateWhenDayPass] Final Current Date: %s", dateStr))
end

function OnDayPassedEvent(events_manager, event_id, event)
    if (
            event_id == ENUM_CM_EVENT_MSG_DAY_PASSED
    ) then
        updateDateWhenDayPass()
    end
end

AddEventHandler("post__CareerModeEvent", OnDayPassedEvent)

local attributeNameList = {
    "birthdate",
    "overallrating",
    "potential",
    "nationality",
    "height",
    "weight",
    "preferredfoot",
    "preferredposition1",
    "preferredposition2",
    "preferredposition3",
    "preferredposition4",
    "skillmoves",
    "weakfootabilitytypecode",
    "attackingworkrate",
    "defensiveworkrate",
    "acceleration",
    "sprintspeed",
    "positioning",
    "finishing",
    "shotpower",
    "longshots",
    "volleys",
    "penalties",
    "vision",
    "crossing",
    "freekickaccuracy",
    "shortpassing",
    "longpassing",
    "curve",
    "agility",
    "balance",
    "reactions",
    "ballcontrol",
    "dribbling",
    "composure",
    "interceptions",
    "headingaccuracy",
    "defensiveawareness",
    "standingtackle",
    "slidingtackle",
    "jumping",
    "stamina",
    "strength",
    "aggression",
    "gkdiving",
    "gkhandling",
    "gkkicking",
    "gkpositioning",
    "gkreflexes",
}

function GetUserSeniorTeamPlayerIDs()
    local result = {}
    local userTeamID = GetUserTeamID()
    Log(string.format("User Team ID: %d", userTeamID))

    local careerPlayerContractTable = LE.db:GetTable("career_playercontract")
    local current_record = careerPlayerContractTable:GetFirstRecord()
    local c = 1
    while current_record > 0 do
        local teamID = careerPlayerContractTable:GetRecordFieldValue(current_record, "teamid")
        if teamID == userTeamID then
            local playerID = careerPlayerContractTable:GetRecordFieldValue(current_record, "playerid")
            result[playerID] = true
            Log(string.format("%d: %d", c, playerID))
            c = c + 1
        end
        current_record = careerPlayerContractTable:GetNextValidRecord()
    end

    return result
end

function postPlayers(jsonStr, dateStr)
    Log('[postPlayers] Start')
    local command = 'curl -X POST -H "Content-Type: application/json"'
    command = command .. ' -H "secret-key: {{user-secret-key}}"'

    local fileName = "fifa_career_dashboard_players-" .. dateStr .. ".json"
    local file, error = io.open(fileName, "w")
    if not file then
        print("Error opening file: " .. error)
        return
    else
        print("File opened successfully")
    end
    file:write(jsonStr)
    file:close()
    command = command .. ' -d "@' .. fileName .. '"'

    command = command .. ' ' .. "{{post-player-url}}/api/v1/player/bulk?gameVersion=24"

    Log('[postPlayers] Command: ' .. command)

    os.execute(command)
    Log('[postPlayers] Done')

end

function sendTeamPlayerAttr()
    local bIsInCM = IsInCM()
    if not bIsInCM then
        return
    end
    local dateStr = string.format("%d-%d-%d", currentDateYear, currentDateMonth, currentDateDay)
    Log(string.format("[sendTeamPlayerAttr] Current Date: %s", dateStr))
    local userTeamPlayerIDs = GetUserSeniorTeamPlayerIDs()
    local players_count = table_count(userTeamPlayerIDs)
    local updated_players = 0
    local players_table = LE.db:GetTable("players")
    local current_record = players_table:GetFirstRecord()
    local jsonStr = ""
    jsonStr = jsonStr .. "["
    local playerID = 0
    while current_record > 0 do
        playerID = players_table:GetRecordFieldValue(current_record, "playerid")
        if userTeamPlayerIDs[playerID] then
            local currentPlayerJsonStr = ""
            currentPlayerJsonStr = currentPlayerJsonStr .. "{"
            currentPlayerJsonStr = currentPlayerJsonStr .. string.format('"playerID": %d', playerID)
            local playerName = GetPlayerName(playerID)
            currentPlayerJsonStr = currentPlayerJsonStr .. string.format(', "playerName": "%s"', playerName)
            currentPlayerJsonStr = currentPlayerJsonStr .. string.format(', "currentDate": "%s"', dateStr)
            for i, attrName in ipairs(attributeNameList) do
                local attrValue = players_table:GetRecordFieldValue(current_record, attrName)
                currentPlayerJsonStr = currentPlayerJsonStr .. string.format(', "%s": "%s"', attrName, attrValue)
            end
            currentPlayerJsonStr = currentPlayerJsonStr .. "}"
            updated_players = updated_players + 1
            jsonStr = jsonStr .. currentPlayerJsonStr
            if (updated_players < players_count) then
                jsonStr = jsonStr .. ","
            end
        end
        if (updated_players == players_count) then
            jsonStr = jsonStr .. "]"
            postPlayers(jsonStr, dateStr)
            return
        end
        current_record = players_table:GetNextValidRecord()
    end
end

function OnEvent(events_manager, event_id, event)
    if (event_id == ENUM_CM_EVENT_MSG_WEEK_PASSED) then
        sendTeamPlayerAttr()
    end
end

sendTeamPlayerAttr()
AddEventHandler("post__CareerModeEvent", OnEvent)
`;

export const luaScript_FC25 = `
require 'imports/career_mode/helpers'
require 'imports/other/helpers'
local json = require("imports/external/json")


local pre_cm_event_handlers = GetEventHandlers("pre__CareerModeEvent")
local post_cm_event_handlers = GetEventHandlers("post__CareerModeEvent")

print(string.format("You have %d pre__CareerModeEvents and %d post__CareerModeEvents", #pre_cm_event_handlers,
    #post_cm_event_handlers))

if #pre_cm_event_handlers > 0 then
    -- Remove first pre__CareerModeEvent
    RemoveEventHandler("pre__CareerModeEvent", pre_cm_event_handlers[1].id)
end

if #post_cm_event_handlers > 0 then
    -- Remove first post__CareerModeEvent
    RemoveEventHandler("post__CareerModeEvent", post_cm_event_handlers[1].id)
end

pre_cm_event_handlers = GetEventHandlers("pre__CareerModeEvent")
post_cm_event_handlers = GetEventHandlers("post__CareerModeEvent")

print(string.format("You have %d pre__CareerModeEvents and %d post__CareerModeEvents", #pre_cm_event_handlers,
    #post_cm_event_handlers))

local attributeNameList = {
    "birthdate",
    "overallrating",
    "potential",
    "nationality",
    "height",
    "weight",
    "preferredfoot",
    "preferredposition1",
    "preferredposition2",
    "preferredposition3",
    "preferredposition4",
    "skillmoves",
    "weakfootabilitytypecode",
    -- pace
    "acceleration",
    "sprintspeed",
    -- attacking
    "positioning",
    "finishing",
    "shotpower",
    "longshots",
    "volleys",
    "penalties",
    -- passing
    "vision",
    "crossing",
    "freekickaccuracy",
    "shortpassing",
    "longpassing",
    "curve",
    -- dribbling
    "agility",
    "balance",
    "reactions",
    "ballcontrol",
    "dribbling",
    "composure",
    -- defending
    "interceptions",
    "headingaccuracy",
    "defensiveawareness",
    "standingtackle",
    "slidingtackle",
    -- physical
    "jumping",
    "stamina",
    "strength",
    "aggression",
    -- goalkeeping
    "gkdiving",
    "gkhandling",
    "gkkicking",
    "gkpositioning",
    "gkreflexes",
    -- other
}

function GetUserSeniorTeamPlayerIDs()
    local result = {}
    local userTeamID = GetUserTeamID()
    Log(string.format("User Team ID: %d", userTeamID))

    -- From this table should be the quickest I guess
    local careerPlayerContractTable = LE.db:GetTable("career_playercontract")
    local current_record = careerPlayerContractTable:GetFirstRecord()
    local c = 1
    while current_record > 0 do
        local teamID = careerPlayerContractTable:GetRecordFieldValue(current_record, "teamid")
        if teamID == userTeamID then
            local playerID = careerPlayerContractTable:GetRecordFieldValue(current_record, "playerid")
            result[playerID] = true
            Log(string.format("%d: %d", c, playerID))
            c = c + 1
        end
        current_record = careerPlayerContractTable:GetNextValidRecord()
    end

    return result
end

-- Post to API
function postPlayers(jsonStr, dateStr)
    Log('[postPlayers] Start')
    local command = 'curl -X POST -H "Content-Type: application/json"'
    -- add new header - token
    command = command .. ' -H "secret-key: {{user-secret-key}}"'

    -- Save to file, data from file
    local fileName = "fifa_career_dashboard_players_FC25-" .. dateStr .. ".json"
    local file = io.open(fileName, "w")
    file:write(jsonStr)
    file:close()
    command = command .. ' -d "@' .. fileName .. '"'

    -- -- data from string
    -- jsonStr = string.gsub(jsonStr, '"', '\\\\"')
    -- command = command .. ' -d "' .. jsonStr .. '"'

    -- Add URL
    command = command .. ' ' .. "{{post-player-url}}/api/v1/player/bulk?gameVersion=25"

    Log('[postPlayers] Command: ' .. command)

    -- Upload to API
    os.execute(command)
    Log('[postPlayers] Done')

    -- delete file
    --os.remove("fifa_career_dashboard_players.json")
end

function sendTeamPlayerAttr()
    local bIsInCM = IsInCM()
    if not bIsInCM then
        return
    end

    local saveUID = GetSaveUID()

    local currentDate = GetCurrentDate()
    local currentDateYear = currentDate.year
    local currentDateMonth = currentDate.month
    local currentDateDay = currentDate.day
    local dateStr = string.format("%d-%d-%d", currentDateYear, currentDateMonth, currentDateDay)
    Log(string.format("[sendTeamPlayerAttr] Current Date: %s", dateStr))

    local userTeamPlayerIDs = GetUserSeniorTeamPlayerIDs()
    local players_count = table_count(userTeamPlayerIDs)
    local updated_players = 0

    -- Get Players Table
    local players_table = LE.db:GetTable("players")
    local current_record = players_table:GetFirstRecord()

    local jsonStr = ""
    jsonStr = jsonStr .. "["
    -- now is [

    local playerID = 0
    while current_record > 0 do
        playerID = players_table:GetRecordFieldValue(current_record, "playerid")
        if userTeamPlayerIDs[playerID] then
            local currentPlayerJsonStr = ""

            currentPlayerJsonStr = currentPlayerJsonStr .. "{"
            -- now currentPlayerJsonStr is '{'

            -- add playerID
            currentPlayerJsonStr = currentPlayerJsonStr .. string.format('"playerID": %d', playerID)
            -- add playerName
            local playerName = GetPlayerName(playerID)
            currentPlayerJsonStr = currentPlayerJsonStr .. string.format(', "playerName": "%s"', playerName)
            -- add current date
            currentPlayerJsonStr = currentPlayerJsonStr .. string.format(', "currentDate": "%s"', dateStr)
            -- now currentPlayerJsonStr is {"playerID": playerID, "playerName": "playerName", "currentDate": "dateStr"

            -- get all attributes
            for i, attrName in ipairs(attributeNameList) do
                local attrValue = players_table:GetRecordFieldValue(current_record, attrName)
                currentPlayerJsonStr = currentPlayerJsonStr .. string.format(', "%s": "%s"', attrName, attrValue)
                -- now currentPlayerJsonStr is {"playerID": playerID, "playerName": "playerName", "currentDate": "dateStr", "attrName": "attrValue"
            end

            currentPlayerJsonStr = currentPlayerJsonStr .. "}"
            -- now currentPlayerJsonStr is {"playerID": playerID, "playerName": "playerName", "currentDate": "dateStr", "attrName": "attrValue"}

            updated_players = updated_players + 1
            jsonStr = jsonStr .. currentPlayerJsonStr
            -- now jsonStr is [{"playerID": playerID, "playerName": "playerName", "currentDate": "dateStr", "attrName": "attrValue"}
            if (updated_players < players_count) then
                jsonStr = jsonStr .. ","
                -- now jsonStr is [{...},
            end
        end
        if (updated_players == players_count) then
            jsonStr = jsonStr .. "]"
            -- now jsonStr is [{...}, ..., {...}]
            postPlayers(jsonStr, dateStr)
            return
        end
        current_record = players_table:GetNextValidRecord()
    end
end

function OnEvent(events_manager, event_id, event)
    if (
            event_id == ENUM_CM_EVENT_MSG_WEEK_PASSED
        ) then
        sendTeamPlayerAttr()
    end
end

sendTeamPlayerAttr()
AddEventHandler("post__CareerModeEvent", OnEvent)
`;
