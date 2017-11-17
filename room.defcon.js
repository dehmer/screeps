const DEFCON_5 = 5 // FADE OUT: Peace. Lowest state of readiness
const DEFCON_4 = 4 // DOUBLE TAKE: Increased intelligence watch and strengthened security measures
const DEFCON_3 = 3 // ROUND HOUSE: Increase in force readiness above that required for normal readiness
const DEFCON_2 = 2 // FAST PACE: Next step to nuclear war
const DEFCON_1 = 1 // COCKED PISTOL: Nuclear war is imminent

/**
 * Critical infrastructure.
 * Structure is included for DEFCON level and below.
 */
const criticality = {}
criticality[STRUCTURE_TOWER] = DEFCON_1
criticality[STRUCTURE_STORAGE] = DEFCON_1
criticality[STRUCTURE_SPAWN] = DEFCON_2
criticality[STRUCTURE_RAMPART] = DEFCON_3
criticality[STRUCTURE_EXTENSION] = DEFCON_5
criticality[STRUCTURE_CONTAINER] = DEFCON_5

const isCritical = defcon => target => criticality[target.structureType] <= defcon

module.exports = {
  DEFCON_1: DEFCON_1,
  DEFCON_2: DEFCON_2,
  DEFCON_3: DEFCON_3,
  DEFCON_4: DEFCON_4,
  DEFCON_5: DEFCON_5,

  isCritical
}