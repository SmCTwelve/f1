let teams;
let drivers;

// ##### TO DO #####

// Total WCC/WDC titles
// Component penalties polar chart
// Timing line graphs

// Consider using each driver group as seperate datasets per team, with own label, color etc.
// Would avoid having to flatten the 2D arrays, instead using each inner array as a new dataset.

/**Initialise global teams and drivers references. */
export const init = (stats) => {
  teams = Object.keys(stats);
  drivers = teams.map( (team) => {
    return stats[team].drivers;
  });
}

/**Return only the drivers for the given team. */
export const filterDrivers = (stats, team) => {
  return stats[team].drivers;
}

/**Return array of driver codes, optionally filtered by team. */
const getDriverCodes = (stats, team=null) => {
  if (team !== null) {
    return filterDrivers(stats, team).map( (driver) => driver.code);
  }
  return flattenDriverArrays('driver.code');
}

/**Takes two-dimenstional array of driver objects per team and flattens to a single array
 * containing the value of the desired key for each driver, e.g. stats.points.
 *
 * @param {String} key The full key to search for, e.g. "driver.points.stats"
 * @returns {Array} Array of values in the order of the drivers.
 */
const flattenDriverArrays = (key) => {
  return drivers.reduce( (prev, cur) => {
    // driver is used when eval(key) called with string e.g. 'driver.code'
    const val = cur.map( (driver) => eval(key));
    return prev.concat(val);
  }, []);
}

/**Return chart data object with the given values and title. */
const makeDriverChart = (stats, team, values, title) => {
  return {
    labels: getDriverCodes(stats, team),
    datasets: [
      {
        label: title,
        data: values
      }
    ]
  };
}

/**Return chart data representing team championship positions. */
export const teamStandings = (stats, teams) => {
  const points = teams.map( (team) => stats[team].points);
  return {
    labels: teams,
    datasets: [
      {
        label: "Team WCC Standings",
        data: points,
      }
    ]
  };
}

/**Returns chart data for driver poles. Optionally filter only drivers in the team. */
export const driverPoles = (stats, team=null) => {
  let poles;
  if (team !== null) {
    poles = filterDrivers(stats, team).map( (driver) => driver.stats.poles);
  }
  else {
    poles = flattenDriverArrays('driver.stats.poles');
  }
  return makeDriverChart(stats, team, poles, "Pole Positions");
}

/**Return chart with driver win stats. Optional team filter. */
export const driverWins = (stats, team=null) => {
  let wins;
  if (team !== null) {
    wins = filterDrivers(stats, team).map( (driver) => driver.stats.wins);
  }
  else {
    wins = flattenDriverArrays('driver.stats.wins');
  }
  return makeDriverChart(stats, team, wins, "Race Wins");
}

/** Return driver DNF stats with optional filter by team. */
export const driverDNFs = (stats, team=null) => {
  let dnf;
  if (team !== null) {
    dnf = filterDrivers(stats, team).map( (driver) => driver.stats.dnf);
  }
  else {
    dnf = flattenDriverArrays('driver.stats.dnf');
  }
  return makeDriverChart(stats, team, dnf, "Race DNF");
}

/** Return driver championship standings for all drivers or optionally by team. */
export const driverStandings = (stats, team=null) => {
  let pts;
  if (team !== null) {
    pts = filterDrivers(stats, team).map( (driver) => driver.stats.points);
  }
  else {
    pts = flattenDriverArrays('driver.stats.points');
  }
  return makeDriverChart(stats, team, pts, "Driver WDC Standings");
}

export const driverTimings = (driver) => {
  let rounds = [];
  let race = [];
  let quali = [];
  driver.results.forEach( (result) => {
    rounds.push(result.round);
    race.push(result.fastestLap);
    quali.push(result.bestQuali);
  });
  return {
    labels: rounds,
    datasets: [
      {
        label: "Best Lap",
        data: race,
        borderColor: '#bf1429',
        borderWidth: 1,
        fill: false,
        pointRadius: 1.5,
        spanGaps: true
      },
      {
        label: "Qualifying",
        data: quali,
        borderColor: '#287b49',
        borderWidth: 1,
        fill: false,
        pointRadius: 1.5,
        spanGaps: true
      }
    ]
  };
}

/**
 * Return chart combining win and poles for single driver object.
 */
export const driverPoleVsWins = (driver) => {
  const wins = [driver.stats.wins];
  const poles = [driver.stats.poles];
  console.log(wins, poles);
  return {
    labels: [],
    datasets: [
      {
        label: "Wins",
        data: wins
      },
      {
        label: "Poles",
        data: poles
      }
    ]
  };
}

// Start vs finish line (per driver card)
// FastestLap vs Quali vs Speed (buttons mode like team points graph) per teammate (dataset)
// Pole vs wins doughnut (per driver card)
// Engine component polar (per driver card)