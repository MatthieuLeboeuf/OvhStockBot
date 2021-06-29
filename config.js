const ks = {
    'KS-1': ['1801sk12', '1804sk12'],
    'KS-2': ['1801sk13'],
    'KS-3': ['1801sk14'],
    'KS-4': ['1801sk15'],
    'KS-5': ['1801sk16', '1804sk16'],
    'KS-6': ['1801sk17'],
    'KS-7': ['1801sk18', '1804sk18'],
    'KS-8': ['1801sk19'],
    'KS-9': ['1801sk20', '1804sk20'],
    'KS-10': ['1801sk21', '1804sk21'],
    'KS-11': ['1801sk22', '1804sk22'],
    'KS-12': ['1801sk23', '1804sk23'],
};

const sys = {
    'E3-SAT-1-16': ['2101sys15', '2104sys15'],
    'E3-SSD-1-32': ['2101sys16', '2104sys16'],
    'E3-SAT-1-32': ['2101sys17', '2104sys17'],
    'E3-SSD-2-32': ['2101sys19', '2104sys19'],
    'E3-SAT-2-32': ['2101sys20', '2104sys20'],
    'E5-SAT-1-64': ['2101sys21', '2104sys21'],
    'E5-SSD-1-64': ['2101sys22', '2104sys22'],
    'E5-SSD-2-64': ['2101sys23', '2104sys23'],
    'E5-SAT-2-64': ['2101sys24', '2104sys24'],
    'XEON-SATA-2-64': ['2001sys24', '2004sys24'],
    'XEON-NVME-2-64': ['2001sys23', '2004sys23'],
    'GAME-1': ['2101sysgame01', '2104sysgame01'],
    'GAME-2': ['2101sysgame02', '2104sysgame02'],
    'GAME-3': ['2101sysgame03', '2104sysgame03']
};

const ovh = {
    'ADVANCED-2': ['20adv02'],
    'ADVANCED-3': ['20adv03'],
    'GAME-1': ['21game01'],
    'GAME-2': ['21game02'],
    'INFRA-1': ['19infra01'],
    'INFRA-2': ['19infra02'],
    'ADVANCED-STOR-1': ['19stor01'],
    'ADVANCED-STOR-2': ['19stor02'],
    'RISE-1': ['19rise01'],
    'RISE-2': ['20rise09']
};

const locations = {
    'ks': {
        'gra': true,
        'rbx': true,
        'bhs': true
    },
    'sys': {
        'gra': true,
        'rbx': true,
        'bhs': true
    },
    'ovh': {
        'gra': true,
        'rbx': true,
        'bhs': true,
        'fra': true
    }
};

module.exports = {
    ks, sys, ovh, locations
}