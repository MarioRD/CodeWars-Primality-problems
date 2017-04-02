/*
Time Complexity Analysis (just for fun): 
If we consider that modulo operations require a constant time, given a big N, 
we can always find that constant (even if really big)  that is independent by the size of n.
Then if the previous assumption is verified the following algorithm would perform 
worst if all multiplicities were one (i.e. we would have to search up to N primes) and hence the 
algorithm would be of a complexity of :
pf(n) = O(π(n)log_2(n)) = O((nlog_2(n))/ln(n)) =O(nln(n)/(ln(n)ln(2))) = O(n)/ln(2) = O(n)  
Hence this algorithm would perform asymptotically in linear time (for C>=1/ln(2)=log_2(e))
Notice how I added log_2(n) to the prime counting function (π(x)) as the primality test I 
perform could possibly find a radius that is up to (2^r)=p-1 .... by induction when p->infinity p~p-1 
*/
//Fast modular exponentiation using square reduction
//I actually had implemented a binary expansion one myself (so it should be faster than this one), 
//but it was timing out strangely on these servers (i think it was due to the length of the code)
//This algo is strongly inspired by stackoverflow.com/questions/8287144/modulus-power-of-big-numbers
function md(b, e, mod) {
    if (b < 1 || e < 0 || mod < 1) {
        return -1;
    }

    var res = 1;
    do {
        if (e & 1) {
            res = (res * b) % mod;
        }
        b = (b * b) % mod;
        e = Math.floor(e / 2);
    } while (e > 0)
    return res;
}


//Prime hashtable generation (once per all test case )
//We generate the needed primes up to a given  N (N=104729)
function Primes() {
    var primes = [2];
    for (var i = 3; i < 104730; i += 2) {
        if (_isPrime(i)) {
            primes[primes.length] = i
        }
    }
    this.primes = primes;
}
var thePrimes = new Primes();

function PrimeFactorizer(num) {
    this.factor = _factor(num);
}


//Main factorizer
function _factor(n, result = {}) {
    for (var i = 0, p = thePrimes.primes[0]; thePrimes.primes[i] <= n; ++i, p = p = thePrimes.primes[i]) {
        if (n % p == 0) {
            result["" + p] = _mult(n / p, p);
            n /= Math.pow(p, result["" + p]);
            if (_isPrime(n)) {
                result["" + n] = 1;
                break;
            }
        }
    }
    return result;
}


//Multiplicity finder
function _mult(n, p) {
    var result = 1;
    do {
        n /= p;
        if (n % 1 != 0) break;
        ++result;
    } while (true);
    return result;
}



//Using modified version of SPRP BSW conjecture
//Inspired by http://ceur-ws.org/Vol-1326/020-Forisek.pdf 
function _isPrime(p) {
    //Hard coded table needed for the conjecture
    //https://oeis.org/A001262
    var pseudoPrim = new Set(
        [2047, 3277, 4033, 4681, 8321, 15841, 29341, 42799, 49141, 52633, 65281, 74665, 80581,
            85489, 88357, 90751, 104653, 130561, 196093, 220729, 233017, 252601, 253241, 256999,
            271951, 280601, 314821, 357761, 390937, 458989, 476971, 486737
        ]);

    if (p & 0 || (p != 3 && p % 3 == 0) || Math.sqrt(p) % 1 == 0 || (p != 5 && p % 5 == 0) ||
        (p != 7 && p % 7 == 0) || pseudoPrim.has(p) || (p != 61 && p % 61 == 0)) return false;
    var d = (p - 1) / 2;
    // var s = 1
    for (var s = 1;; ++s, d /= 2) {
        if ((d / 2) % 1 != 0) {
            break;
        }
        // d /= 2;
        // ++s;
    }
    for (var r = 0, pow = d; r < s; ++r, pow = d * Math.pow(2, r)) {

        if (md(2, pow, p) == p - 1 || md(7, pow, p) == p - 1 || md(61, pow, p) == p - 1) {
            return true;

        }
    }
    return md(2, d, p) == 1 || md(7, d, p) == 1 || md(61, d, p) == 1;
}
