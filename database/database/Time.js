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
              resolve({result: result, statId: result.generated_keys[0]});
            });
      });
    },
    createStatBlock: function createStatBlock(statBlock) {
      return new Promise(function (resolve, reject) {
        r.db('console').table('statBlocks')
          .insert(statBlock)
            .run(connection, function(err, result) {
              if (err) reject(err);
              resolve({result: result, statBlockId: result.generated_keys[0]});
            });
      });
    },
    createDay: function createDay(day) {
      return new Promise(function (resolve, reject) {
        r.db('console').table('days')
          .insert(day)
            .run(connection, function(err, result) {
              if (err) reject(err);
              resolve({result: result, dayId: result.generated_keys[0]});
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
                  resolve({result: result, statId: statId, statBlockId: statBlockId});
                });
      });
    },
    addStatBlockToDay: function addStatBlockToDay(statBlockId, parentId) {
      return new Promise(function (resolve, reject) {
        r.db('console').table('days')
          .get(parentId)
            .update({statBlocks: r.row("statBlocks").append(statBlockId)})
              .run(connection, function(err, result) {
                if (err) reject(err);
                resolve({result: result, statBlockId: statBlockId, parentId: parentId});
              });
      });
    },
    addDayToLog: function addStatBlockToLog(dayId, dateString, logId) {
      return new Promise(function (resolve, reject) {
        r.db('console').table('log')
          .get(logId)
            .update({days: r.row("days").append(dayId), lastUpdate: dateString})
        .run(connection, function(err, result) {
                  if (err) reject(err);
                  resolve({result: result, dayId: dayId, logId: logId});
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
        r.db('journey').table('journey')
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
          .get(id)
            .run(connection, function(err, result) {
              if (err) reject(err);
              resolve(result);
            });
      });
    },
    addJournalToJourney: function addJournalToJourney(journalId) {
      r.db('journey').table('journey')
        .get(8)
          .update({journals: r.row('journals').append(journalId)})
            .run(connection, function(err, result) {
                      if (err) reject(err);
                      resolve({result: result, journalId: journalId});
                    });
    },
    addContentToJournal: function addContentToJournal() {},
    updateWeight: function updateWeight(dayId, weight) {
      return new Promise(function (resolve, reject) {
        r.db('console').table('days')
          .get(dayId)
            .update({weight: weight})
              .run(connection, function(err, result) {
                if (err) reject(err);
                resolve({result: result, dayId: dayId});
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
                resolve({result: result, stat:stat});
              });
      });
    },
    getTypes: function getTypes(objectType, parentType) {
      return new Promise(function(resolve, reject) {
        r.db('unity').table('objectTypes')
          .filter(function(type) {
            return type("parentTypes").contains(parentType).and(type("objectType").eq(objectType));
          })
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
