import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { COLORS } from "../utils";
import { baseurl } from "../config/baseurl";

const StockTracker = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [previousPrice, setPreviousPrice] = useState(0);
  const [chartData, setChartData] = useState([]);

  const fetchStocks = async () => {
    const response = await fetch(`${baseurl}/stocks`);
    const data = await response.json();
    setStocks(data);
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchStocks();
      setSelectedStock(data[0]?.symbol);
      setCurrentPrice(data[0]?.price[0]);
      updateChartData(data[0]?.symbol, data[0]?.price[0]);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchStocks();
      if (stocks.length > 0) {
        const randomStock = stocks[Math.floor(Math.random() * stocks.length)];
        const randomIndex = Math.floor(
          Math.random() * randomStock.price.length
        );
        setPreviousPrice(currentPrice);
        setCurrentPrice(randomStock.price[randomIndex]);
        updateChartData(randomStock.symbol, randomStock.price[randomIndex]);
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [stocks]);

  const updateChartData = (symbol, price) => {
    setChartData((prevChartData) => {
      const updatedData = [...prevChartData];
      const stockData = updatedData.find((data) => data.symbol === symbol);

      if (stockData) {
        stockData.data.push({ price, time: new Date().toLocaleTimeString() });
      } else {
        updatedData.push({
          symbol,
          data: [{ price, time: new Date().toLocaleTimeString() }],
        });
      }

      return updatedData;
    });
  };

  const handleStockChange = (e) => {
    setSelectedStock(e.target.value);
    const selectedStockData = stocks.find(
      (stock) => stock.symbol === e.target.value
    );
    if (selectedStockData?.price && selectedStockData.price.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * selectedStockData.price.length
      );
      setPreviousPrice(currentPrice);
      setCurrentPrice(selectedStockData.price[randomIndex]);
      updateChartData(
        selectedStockData.symbol,
        selectedStockData.price[randomIndex]
      );
    } else {
      setPreviousPrice(0);
      setCurrentPrice(null);
    }
  };

  return (
    <Box m={5}>
      <FormControl sx={{ m: 1, minWidth: 100 }}>
        <InputLabel id="demo-simple-select-label">Stock</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedStock}
          onChange={handleStockChange}
          label="Stock"
        >
          {stocks.map((stock) => (
            <MenuItem key={stock.symbol} value={stock.symbol}>
              {stock.symbol}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {stocks.length > 0 && (
        <Box>
          <Typography variant="h4">
            Current Price: ${currentPrice}
            {currentPrice > previousPrice ? (
              <IconButton color="success">
                <AddIcon />
              </IconButton>
            ) : (
              <IconButton color="error">
                <RemoveIcon />
              </IconButton>
            )}
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "center", margin: "1rem" }}
          >
            <AreaChart
              width={500}
              height={300}
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="time" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              {chartData.map((stockData, index) => (
                <Area
                  key={stockData.symbol}
                  type="monotone"
                  dataKey="price"
                  data={stockData.data}
                  name={stockData.symbol}
                  fillOpacity={0.3}
                  fill={COLORS[index % COLORS.length]} // Assign a color from the palette for the area
                  stroke={COLORS[index % COLORS.length]} // Assign a color from the palette for the line
                />
              ))}
            </AreaChart>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default StockTracker;
