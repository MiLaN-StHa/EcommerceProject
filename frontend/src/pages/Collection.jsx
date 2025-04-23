import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  const toggleCategory = (value) => {
    setCategory(value);
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category && category !== "All") {
      productsCopy = productsCopy.filter((item) => {
        return (
          item.category === category ||
          (category !== "Unisex" && item.category === "Unisex")
        );
      });
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    if (sortType === "low-high") {
      productsCopy.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      productsCopy.sort((a, b) => b.price - a.price);
    }

    setFilterProducts(productsCopy);
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products, sortType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 pt-10 border-t">
        {/* Filter sidebar */}
        <div className="lg:min-w-64 lg:max-w-64">
          <div 
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-lg lg:bg-transparent lg:p-0"
          >
            <p className="text-lg font-medium">FILTERS</p>
            <img
              src={assets.dropdown_icon}
              className={`h-3 transition-transform duration-200 lg:hidden ${
                showFilter ? "rotate-180" : ""
              }`}
              alt=""
            />
          </div>

          {/* SubCategory Filter */}
          <div
  className={`bg-white lg:bg-transparent rounded-xl shadow-md lg:shadow-none p-5 lg:p-0 mt-6 border border-gray-200 lg:border-none transition-all duration-300 ${
    showFilter ? "block" : "hidden lg:block"
  }`}
>
  <p className="text-base font-semibold mb-3 text-gray-800">Filter by Type</p>
  <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
    {["ring", "earring", "bracelet", "necklace"].map((type) => (
      <label
        key={type}
        className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer transition-all duration-200 text-sm font-medium text-gray-700"
      >
        <input
          type="checkbox"
          className="w-4 h-4 text-gray-800 border-gray-300 rounded focus:ring-2 focus:ring-gray-500"
          value={type}
          checked={subCategory.includes(type)}
          onChange={toggleSubCategory}
        />
        <span>{type === "necklace" ? "Pendant / Necklace" : type}</span>
      </label>
    ))}
  </div>
</div>

        </div>

        {/* Right Side */}
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <Title text1={"ALL"} text2={"COLLECTIONS"} />
              <div className="flex flex-wrap gap-2">
                {["All", "Men", "Women", "Unisex"].map((gen) => (
                  <button
                    key={gen}
                    onClick={() => toggleCategory(gen)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      category === gen
                        ? "bg-gray-900 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                    }`}
                  >
                    {gen}
                  </button>
                ))}
              </div>
            </div>
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="w-full lg:w-auto px-4 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            >
              <option value="relavent">Sort by: Relevance</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
