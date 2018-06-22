
class PriceCalculator {
    constructor(array, qty, size) {
        this.array = array;
        this.qty = qty;
        this.size = size;
        this.priceArray;
    }
    calculate(){
        console.log(this.array)
        if (this.size === "1") {
            return this.calculateLarge();
          } else {
            return this.calculateMedium();
          }
    }
    calculateLarge() {
     
        this.priceArray = this.array.map(function (val) {
            console.log(val);
            let p = parseFloat(val['price']) + parseFloat(val['surcharge']);
            if(!isNaN(p)) return p;
        })

        return this.getTotal();
    }
    calculateMedium() {
        var arr = [];
        this.array.forEach(function (val) {
            let p = parseFloat(val['price']);
            if(!isNaN(p)) arr.push(p)

        })
        this.priceArray = arr;

        return this.getTotal();
    }
    getTotal() {
        if (!this.priceArray) return;
        function getSum(total, num) {
            return total + num;
        }
        var sum = this.priceArray.reduce(getSum);
        var cost = sum * this.qty;
        var total = cost + cost * 0.005;

        return total.toFixed(2);
    }

 
}

module.exports = PriceCalculator;
