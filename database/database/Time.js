require("babel-register")({
  presets: ['es2015']
});
import r from 'rethinkdb';

var rethinkTime = function rethinkTime(connection) {
  var DBHOST = process.env.RDB_HOST || 'localhost';
  var DBPORT = process.env.RDB_PORT || 28015;
  if (!connection) {
    var connection = null;
    r.connect({host: DBHOST, port: DBPORT}, function(err, conn) {
        if (err) throw(err);
        connection = conn;
      });
  }
  return {
    createStat: function createStat(stat) {
      return new Promise(function (resolve, reject)  {
        r.db('console').table('stats')
          .insert(stat)
            .run(connection, function(err, result) {
              if (err) reject(err);
              resolve(result);
            });
      });
    },
    createStatBlock: function createStatBlock(statBlock) {
      return new Promise(function (resolve, reject) {
        r.db('console').table('statBlocks')
          .insert(statBlock)
            .run(connection, function(err, result) {
              if (err) reject(err);
              resolve(result);
            });
      });
    },
    createDay: function createDay(day) {
      return new Promise(function (resolve, reject) {
        r.db('console').table('days')
          .insert(day)
            .run(connection, function(err, result) {
              if (err) reject(err);
              resolve(result);
            });
      });
    },
    addStatToBlock: function addStatToBlock(statId, statBlockId) {
      return new Promise(function (resolve, reject) {
          r.db('console').table('statBlocks')
            .get(statBlockId)
              .update({stats: r.row("stats").append(statId)})
                .run(connection, function(err, result) {
                  if (err) reject(err);
                  resolve(result);
                });
      });
    },
    addStatBlockToDay: function addStatBlockToDay(statBlockId, dayId) {
      return new Promise(function (resolve, reject) {
        r.db('console').table('days')
          .get(dayId)
            .update({statBlocks: r.row("statBlocks").append(statBlockId)})
              .run(connection, function(err, result) {
                if (err) reject(err);
                resolve(result);
              });
      });
    },
    addDayToLog: function addStatBlockToLog(dayId, monthId) {
      return new Promise(function (resolve, reject) {
        r.db('console').table('months')
          .get(dayId)
            .update({statBlocks: r.row("statBlocks").append(statBlockId)})
              .run(connection, function(err, result) {
                if (err) reject(err);
                resolve(result);
              });
      });
    },
    getStat: function getStat(statId) {
        return new Promise(function (resolve, reject) {
          r.db('console').table('stats')
            .get(statId)
              .run(connection, function(err, result) {
                if (err) reject(err);
                resolve(result);
              });
        });
    },
    getStatBlock: function getStatBlock(statBlockId) {
      return new Promise(function (resolve, reject) {
        r.db('console').table('statBlocks')
          .get(statBlockId)
            .run(connection, function(err, result) {
              if (err) reject(err);
              resolve(result);
            });
      });
    },
    getGoal: function getGoal(type) {
      return new Promise(function (resolve, reject) {
        r.db('console').table('goals')
          .filter(r.row("type").eq(type))
            .coerceTo('array')
              .run(connection, function(err, result) {
                if (err) reject(err);
                resolve(result[0]);
              });
      });
    },
    getDay: function getDay(id) {
      return new Promise(function (resolve, reject) {
        r.db('console').table('days')
          .get(id)
            .run(connection, function(err, result) {
              if (err) reject(err);
              resolve(result);
            });
      });
    },
    getLog: function getLog(id) {
      return new Promise(function (resolve, reject) {
        r.db('console').table('log')
          .get(id)
            .run(connection, function(err, result) {
              if (err) reject(err);
              resolve(result);
            });
      });
    },
    getJournal: function getJournal(id) {
      return new Promise(function (resolve, reject) {
        r.db('journey').table('journals')
          .get(id)
            .run(connection, function(err, result) {
              if (err) reject(err);
              resolve(result);
            });
      });
    },
    getJourney: function getJourney() {
      return new Promise(function (resolve, reject) {
        r.db('journey').table('journals')
          .get(8)
            .run(connection, function(err, result) {
              if (err) reject(err);
              resolve(result);
            });
        });
    },
    getContent: function getContent(id) {
      return new Promise(function (resolve, reject) {
        r.db('journey').table('content')
          .get(statBlockId)
            .run(connection, function(err, result) {
              if (err) reject(err);
              resolve(result);
            });
      });
    },
    updateWeight: function updateWeight(dayId, weight) {
      return new Promise(function (resolve, reject) {
        r.db('console').table('days')
          .get(dayId)
            .update({weight: weight})
              .run(connection, function(err, result) {
                if (err) reject(err);
                resolve(result);
              });
      });
    },
    updateStat: function updateStat(stat) {
      return new Promise(function (resolve, reject) {
        r.db('console').table('stats')
          .get(stat.id)
            .update(stat)
              .run(connection, function(err, result) {
                if (err) reject(err);
                resolve(result);
              });
      });
    },
    getTypes: function getTypes(objectType, parentType) {
      return new Promise(function(resolve, reject) {
        r.db('unity').table('objectTypes')
  					.coerceTo('array')
              .run(connection, function(err, result) {
                if (err) reject(err);
                resolve(result);
              });
      });
    }
  };
};
var getTypes = function(typeType, parentType) {
  if (typeType == "StatBlock") {
    return statBlockTypes
                      .filter(function(e) {
                        var parentOf = false;
                        e.parentTypes.forEach(function(e){
                          if (e === parentType) {
                            parentOf = true;
                          }
                        });
                        return parentOf;
                      });
  } else if (typeType == "Stat") {
    return statTypes
                .filter(function(e) {
                  var parentOf = false;
                  e.parentTypes.forEach(function(e){
                    if (e === parentType) {
                      parentOf = true;
                    }
                  });
                  return parentOf;
                });
  }
}
var time = rethinkTime();
export default time;

//time.createStat().then(function(e) {console.log(e.generated_keys[0]);});
