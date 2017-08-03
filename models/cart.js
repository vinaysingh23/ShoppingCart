module.exports = function Cart (oldCart) {
	this.items = oldCart.items || {} ;
	this.totalQty = oldCart.totalQty || 0;
	this.totalPrice =oldCart.totalPrice || 0;

	this.add = (item, id)=> {
		let storedItem = this.items[id];

		if(!storedItem) {
			storedItem = this.items[id] = {item: item , qty: 0, price: 0};
		}
		storedItem.qty++;
		storedItem.price = storedItem.item.price * storedItem.qty;
		this.totalPrice += storedItem.item.price;
		this.totalQty++;
	};

	this.reduceByOne = (id)=> {
		this.items[id].qty--;
		this.items[id].price -= this.items[id].item.price;
		this.totalPrice -= this.items[id].item.price;
		this.totalQty--;
		
		if(this.items[id].qty <= 0){	
			delete this.items[id];
		}

	};

	this.addByQty = (id, qty)=> {
		if(qty > 0){
			this.items[id].qty += Number(qty);
			this.items[id].price += this.items[id].item.price * qty;
			this.totalPrice += this.items[id].item.price * qty;
			this.totalQty += Number(qty);
		}else{
			if(this.items[id].qty > -qty){
				this.items[id].qty += Number( qty);
				this.items[id].price += this.items[id].item.price * qty;
				this.totalPrice += this.items[id].item.price * qty;
				this.totalQty += Number(qty);
			}else{
				this.totalPrice -= this.items[id].price;
				this.totalQty -= this.items[id].qty;
				delete this.items[id];
			}
		}
	};

	this.remove = (id)=> {
		this.totalPrice -= this.items[id].price;
		this.totalQty -= this.items[id].qty;
		delete this.items[id];
	};

	this.generateArr = ()=> {
		let arr = [];
		for(let id in this.items) {
			arr.push(this.items[id]);
		}
		return arr;
	};	
};