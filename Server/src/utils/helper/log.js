// logHelper.js
import useragent from "express-useragent";
import { createLogsActivity } from "../../modules/user/user.repository.js";

export function parseUserAgent(req) {
  const ua = useragent.parse(req.headers['user-agent'] || "");
  return {
    os: ua.os,
    browser: ua.browser,
    platform: ua.platform,
    isMobile: ua.isMobile,
  };
}

export async function logActivity(req, action, userid) {
  const uaInfo = parseUserAgent(req);
  const log = {
    action,
    userid,
    ip: req.headers['x-forwarded-for'] || req.ip,
    ...uaInfo,
    timestamp: new Date(),
  };
  await createLogsActivity(log);
  return log;
}
