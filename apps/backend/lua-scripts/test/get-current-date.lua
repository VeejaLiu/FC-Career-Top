require 'imports/career_mode/helpers'
require 'imports/other/helpers'

local currentDate = GetCurrentDate()

local systemDateYear = currentDate.year
local systemDateMonth = currentDate.month
local systemDateDay = currentDate.day

local currentDateYear = currentDate.year
local currentDateMonth = currentDate.month
local currentDateDay = currentDate.day
print(string.format("Current Date: %d-%d-%d", currentDateYear, currentDateMonth, currentDateDay))


function addOneDay()
    -- 创建时间表
    local time_table = {
        year = currentDateYear,
        month = currentDateMonth,
        day = currentDateDay,
        hour = 0,
        min = 0,
        sec = 0
    }

    -- 获取当前时间戳
    local timestamp = os.time(time_table)

    -- 加一天（24小时）
    local new_timestamp = timestamp + 24 * 60 * 60

    -- 更新全局变量
    local new_time_table = os.date("*t", new_timestamp)
    y, m, d = new_time_table.year, new_time_table.month, new_time_table.day
    currentDateYear = y
    currentDateMonth = m
    currentDateDay = d
end

function updateDateWhenDayPass()
    -- 先尝试使用内置函数获取当前时间
    local currentDate = GetCurrentDate()
    --如果这个时间没有更新，说明这个值没有被更新，这个值不能用，需要自己计算
    if (currentDate.year == systemDateYear
            and currentDate.month == systemDateMonth
            and currentDate.day == systemDateDay
        ) then
        addOneDay()
        local dateStr = string.format("%d-%d-%d", currentDateYear, currentDateMonth, currentDateDay)
        print(string.format("Current Date: %s", dateStr))
        return
    end

    -- 如果这个值被更新了，说明这个值是可以用的，返回这个值，并且更新我们自己存储的时间
    -- 更新系统时间
    systemDateYear = currentDate.year
    systemDateMonth = currentDate.month
    systemDateDay = currentDate.day
    -- 更新我们自己存储的时间
    currentDateYear = currentDate.year
    currentDateMonth = currentDate.month
    currentDateDay = currentDate.day

    local dateStr = string.format("%d-%d-%d", currentDate.year, currentDate.month, currentDate.day)
    Log(string.format("Current Date: %s", dateStr))
end

function OnEvent(events_manager, event_id, event)
    if (
            event_id == ENUM_CM_EVENT_MSG_DAY_PASSED
        ) then
        updateDateWhenDayPass()
    end
end

AddEventHandler("post__CareerModeEvent", OnEvent)
