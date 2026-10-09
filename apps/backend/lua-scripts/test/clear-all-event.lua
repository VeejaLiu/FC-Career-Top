local pre_cm_event_handlers = GetEventHandlers("pre__CareerModeEvent")
local post_cm_event_handlers = GetEventHandlers("post__CareerModeEvent")

print(string.format("You have %d pre__CareerModeEvents and %d post__CareerModeEvents", #pre_cm_event_handlers, #post_cm_event_handlers))

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

print(string.format("You have %d pre__CareerModeEvents and %d post__CareerModeEvents", #pre_cm_event_handlers, #post_cm_event_handlers))