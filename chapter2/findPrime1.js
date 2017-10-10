//########################
// 问题：找出小于N的所有素数
//########################

/**
 * @method 试除法v1
 * @desc 检查每一个数N，在2～sqrt(K)区间内是否含有它的因子。
 */
var primes = [];

function findPrimeV1(N) {
    var i = 2, j = 2;
    var count = 0;

    for(; i < N; i++) {
        count++;
        var k = false;
        for(; j < i; j++) {
            count++;
            if (i % j === 0) {
                k = true;
            }
        }
        if (!k) {
            primes.push(i);
        }
        j = 2;
    }
    console.log('执行了: %s次', count);
}

function findPrimeV2(N) {
    var i = 2, j = 2;
    var count = 0;

    for(; i < N; i++) {
        count++;
        var k = false;
        for(; j <= Math.floor(i / 2); j++) {
            count++;
            if (i % j === 0) {
                k = true;
            }
        }
        if (!k) {
            primes.push(i);
        }
        j = 2;
    }
    console.log('执行了: %s次', count);
}


function findPrimeV3(N) {
    var i = 2, j = 2;
    var count = 0;

    for(; i < N; i++) {
        count++;
        var k = false;
        var temp = Math.floor(i / 2);
        if (j === 2 && i % j === 0) {
            k = true;
            primes.push(i);
        }
        j++;
        for(; j <= temp; j+=2) {
            count++;
            if (i % j === 0) {
                k = true;
            }
        }
        if (!k) {
            primes.push(i);
        }
        j = 2;
    }
    console.log('执行了: %s次', count);
}

function main() {
    // findPrimeV1(100);
    // findPrimeV2(100);
    findPrimeV3(100);

    console.log(primes.join(','));    
}

main();