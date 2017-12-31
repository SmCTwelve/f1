> Formula 1 Statistics 

A React web application displaying statistical data for Formula 1 teams and drivers. 

https://smctwelve.github.io/f1/

### About

Features a responsive mobile design with Progressive Web App functionality to dynamically show statistical information about F1 teams - such as championship standings, driver comparisons of poles, wins, points and penalty accumulation as data visualisations. 

Built using dynamic React Components and ChartJS and styled with Sass, served as a bundled JS file using Webpack.  

Data is sourced from [Ergast API](http://ergast.com/mrd/) and processed using a NodeJS back-end serving compressed JSON to be cached by the client for chart rendering. Data can be updated manually via the NodeJS interface using commands, including selectively updating only stats which have changed, e.g. fetching driver stats after a race weekend. Automatic updating based on race schedule via a hosted server is a planned implementation. 

### Installation

The application, including the development environment and all dependencies, may be installed locally by forking or downloading the repository. Then, in the project root run:  

`npm install` 

Requires a [NodeJS](https://nodejs.org/en/) installation. 

After install the Webpack Dev Server can be started with `npm start`. 

### Usage

A basic NodeJS API is included to fetch and update the stats. The following commands should be run from the `./src/data/api` directory. 

`node data <create | -c>`

Backs up the existing `stats.json` file in the root `/data` directory if it exists, then fetches all team and driver data from scratch, creating a new file. This involves making many requests for the Ergast API and processing the results and should be used only when all data needs to be updated.  

`node data <update | -u [all|results]>`

`update all` or `-a` is similar to `create` but only fetches data for each team such as driver stats, not the team data itself as this is unlikely to change. 

`update results` or `-r` only fetches stats for each driver within a team, such as points, wins and poles. It does not fetch the teams or drivers themselves, only replaces existing values. 
