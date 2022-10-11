#!/usr/bin/env node

import minimist from "minimist";
import { argv } from "./argv";
import { queryCookies } from "./queryCookies";
import { groupBy } from "lodash";
import { green, red, yellow } from "colorette";
import { resultsRendered } from "./resultsRendered";
import { fetchWithCookies } from "./fetchWithCookies";
import { unpackHeaders } from "./unpackHeaders";
import CookieSpec from "./CookieSpec";

const parsedArgs: minimist.ParsedArgs = minimist(argv.slice(2));

async function cliQueryCookies({ name, domain }: CookieSpec) {
  try {
    const results = await queryCookies({ name, domain });
    if (results == null || results.length == 0) {
      console.error(red("No results"));
      return;
    }
    if (parsedArgs["dump"] || parsedArgs["d"]) {
      console.log(results);
      return;
    }
    if (parsedArgs["dump-grouped"] || parsedArgs["D"]) {
      const groupedByFile = groupBy(results, (r) => r.meta?.file);
      console.log(green(JSON.stringify(groupedByFile, null, 2)));
      return;
    }
    if (
      parsedArgs["render"] ||
      parsedArgs["render-merged"] ||
      parsedArgs["r"]
    ) {
      console.log(yellow(resultsRendered(results)));
      return;
    }
    if (parsedArgs["render-grouped"] || parsedArgs["R"]) {
      const groupedByFile = groupBy(results, (r) => r.meta?.file);
      for (const file of Object.keys(groupedByFile)) {
        let results = groupedByFile[file];
        console.log(green(file) + ": ", yellow(resultsRendered(results)));
      }
      return;
    }
    for (const result of results) {
      console.log(result.value);
    }
  } catch (e) {
    console.error(e);
  }
}

function main() {
  if (parsedArgs["help"] || parsedArgs["h"]) {
    console.log(`Usage: ${argv[1]} [name] [domain] [options] `);
    console.log(`Options:`);
    console.log(`  -h, --help: Show this help`);
    console.log(`  -v, --verbose: Show verbose output`);
    console.log(`  -d, --dump: Dump all results`);
    console.log(`  -D, --dump-grouped: Dump all results, grouped by profile`);
    console.log(`  -r, --render: Render all results`);
    return;
  }

  const fetchUrl: string = parsedArgs["fetch"] || parsedArgs["F"];
  if (fetchUrl) {
    let url: URL;
    try {
      url = new URL(<string>fetchUrl);
    } catch (e) {
      console.error("Invalid URL", fetchUrl);
      return;
    }
    const headerArgs: string[] | string = parsedArgs["H"];
    const headers = unpackHeaders(headerArgs);
    const onfulfilled = (res: Response) => {
      if (parsedArgs["dump-response-headers"]) {
        res.headers.forEach((value: string, key: string) => {
          console.log(`${key}: ${value}`);
        });
      }
      if (parsedArgs["dump-response-body"]) {
        res.text().then((r) => {
          console.log(r);
        });
      }
      return;
    };
    fetchWithCookies(
      url,
      {
        //
        headers,
      }
      //
    ).then(
      onfulfilled,
      console.error
      //
    );
    return;
  }

  const cookieSpec: CookieSpec = {
    name: parsedArgs["name"] || parsedArgs["_"][0] || "%",
    domain: parsedArgs["domain"] || parsedArgs["_"][1] || "%",
  };

  cliQueryCookies(cookieSpec).catch(console.error);
}

main();
