#!/usr/bin/env node
// noinspection JSUnusedGlobalSymbols

import { queryCookies } from "./queryCookies";
import FirefoxCookieQueryStrategy from "./browsers/FirefoxCookieQueryStrategy";
import ChromeCookieQueryStrategy from "./browsers/ChromeCookieQueryStrategy";
import CompositeCookieQueryStrategy from "./browsers/CompositeCookieQueryStrategy";

/**
 *
 * @param params
 * @returns {Promise<string>}
 */
export async function getCookie(params) {
  const cookies = await queryCookies(
    params,
    new CompositeCookieQueryStrategy()
    //
  );
  if (Array.isArray(cookies) && cookies.length > 0) {
    return cookies.find((cookie) => cookie != null);
  } else {
    throw new Error("Cookie not found");
  }
}

/**
 *
 * @param params
 * @returns {Promise<*>}
 */
export async function getFirefoxCookie(params) {
  const cookies = await queryCookies(
    params,
    new FirefoxCookieQueryStrategy()
    //
  );
  if (Array.isArray(cookies) && cookies.length > 0) {
    return cookies.find((cookie) => cookie != null);
  } else {
    throw new Error("Cookie not found");
  }
}

/**
 *
 * @param params
 * @returns {Promise<*>}
 */
export async function getChromeCookie(params) {
  const cookies = await queryCookies(
    params,
    new ChromeCookieQueryStrategy()
    //
  );
  if (Array.isArray(cookies) && cookies.length > 0) {
    return cookies.find((cookie) => cookie != null);
  } else {
    throw new Error("Cookie not found");
  }
}
