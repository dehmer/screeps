const isStructureType = type => target  => target.structureType === type
const isContainer = isStructureType(STRUCTURE_CONTAINER)
const isTower = isStructureType(STRUCTURE_TOWER)
const isDamaged = target => target.hits < target.hitsMax

const needsEnergy = target => (
        target.structureType == STRUCTURE_SPAWN ||
        target.structureType == STRUCTURE_EXTENSION ||
        target.structureType == STRUCTURE_TOWER
    ) && target.energy < target.energyCapacity

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

const progress = target => target.progress / target.progressTotal
const damage = target => target.hits / target.hitsMax

const damages = (room, filter) =>
    room.find(FIND_STRUCTURES, { filter: filter }).
    sort((a,b) => damage(a) - damage(b))

module.exports = room => {
    return {
        defcon: () => room.memory.defcon || DEFCON_5,
        rcl: () => room.controller.level,
        towers: () => room.find(FIND_STRUCTURES, { filter: isTower }),

        /**
         * All creeps or creeps with given role.
         */
        creeps: role => {
            const filter = role ? creep => creep.memory.role === role : () => true
            return room.find(FIND_MY_CREEPS, { filter: filter })
        },

        spawn: () => room.find(FIND_MY_SPAWNS)[0],

        constructionSites: () =>
            room.find(FIND_CONSTRUCTION_SITES).
            sort((a, b) => progress(a) < progress(b)),

        /**
         * All damages, including roads and walls.
         */
        damages: () => damages(room, isDamaged),

        /**
         * Damages of critical infrastructure.
         * Depends on room's DEFCON level.
         */
        criticalDamages: () => {
            const filter = target => isDamaged(target) && isCritical(room.memory.defcon)(target)
            return damages(room, filter)
        },

        perimeter: () => _.filter(Object.keys(Game.flags), name => name.startsWith('PERIMETER'))
    }
}