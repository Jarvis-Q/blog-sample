//########################
// 问题：找出小于N的所有素数
//########################

/**
 * @method 试除法v1
 * 遍历值到N,然后对每个值进行因子分析，判断是否能整除
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

/**
 * 试除法v2
 * 质因子求解，因为最小的质因子是2，所以最大的质因子排除自身就是N/2了。
 * 所以只要判断是否能被N/2之前的数进行整除就行了。
 */
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

/**
 * 试除法v3
 * 质因子改良版，在方法2的基础上，如果能被N/2之前的数进行整除，那么
 * 这个数有可能是奇数也有可能是偶数，如果是偶数，偶数一定是2的倍数，能被偶数整除的一定* 是合数而非素数，所以只要判断能否被N/2之前的奇数整除即可
 */
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

function findPrimeV4(N) {
    var i = 2, j = 2;
    var count = 0;

    for(; i < N; i++) {
        count++;
        var k = false;
        var temp = Math.floor(Math.sqrt(i));
        
        for(; j <= temp; j++) {
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
    findPrimeV1(1000);
    findPrimeV2(1000);
    findPrimeV3(1000);
    findPrimeV4(1000);

    console.log(primes.join(','));    
}

main();