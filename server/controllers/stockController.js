// controllers/stockController.js
const Stock = require('../models/stock');

const getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const getStockDetails = async (req,res)=>{
    const {id} = req.params;
    try {
       if(!id){
           return res.status(404).json({message:"Stock not found"});
       } else{
        const stock = await Stock.find({_id:id});
        return res.status(200).json({data:stock})
       }
    } catch (error) {
       return res.status(500).json({message:"Internal Server Error!"});
    }
}
const createStock = async (req, res) => {
    const { symbol } = req.body;
  
    try {
      const existingStock = await Stock.findOne({ symbol });
  
      if (existingStock) {
        return res.status(400).json({ message: 'Stock already exists' });
      }
      const priceArray = Array.from({length:10},()=>Math.floor(Math.random()*900)+100);
  
      const newStock = new Stock({ symbol, price:priceArray });
      await newStock.save();
  
      res.status(201).json({ message: 'Stock created successfully', stock: newStock });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };


  module.exports ={getStocks,createStock,getStockDetails};
