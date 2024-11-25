"use client";

import { useState, useEffect } from "react";
import { BeanHead } from "beanheads";
import { IconWallet } from "@tabler/icons-react";
import { AvatarProps } from "beanheads";
import { FloatingDock } from "@/components/ui/floating-dock";

type Option = {
  id: number;
  name: string;
  price: number;
  type: keyof AvatarProps;
  value: string | boolean | undefined;
};

type Category = {
  name: string;
  options: Option[];
};

export default function Marketplace() {
  const initialBalance = 100;

  const [balance, setBalance] = useState<number>(initialBalance);
  const [purchasedOptions, setPurchasedOptions] = useState<number[]>([]);
  const [equippedOptions, setEquippedOptions] = useState<number[]>([]);
  const [bodyType, setBodyType] = useState<"chest" | "breasts">("chest");
  const [skinTone, setSkinTone] = useState<AvatarProps["skinTone"]>("light");
  const [openModal, setOpenModal] = useState<string | null>(null); 

  const options: Option[] = [
    // Accessories
    { id: 1, name: "Shades", price: 25, type: "accessory", value: "shades" },
    { id: 2, name: "Round Glasses", price: 25, type: "accessory", value: "roundGlasses" },
    { id: 3, name: "Tiny Glasses", price: 25, type: "accessory", value: "tinyGlasses" },
  
    // Clothing
    { id: 4, name: "Tank Top", price: 60, type: "clothing", value: "tankTop" },
    { id: 5, name: "Dress Shirt", price: 60, type: "clothing", value: "dressShirt" },
    { id: 6, name: "Shirt", price: 40, type: "clothing", value: "shirt" },
    { id: 7, name: "V-neck", price: 50, type: "clothing", value: "vneck" },
    { id: 8, name: "Dress", price: 100, type: "clothing", value: "dress" },
  
    // Clothing Colors
    { id: 9, name: "White Clothes", price: 10, type: "clothingColor", value: "white" },
    { id: 10, name: "Blue Clothes", price: 10, type: "clothingColor", value: "blue" },
    { id: 11, name: "Black Clothes", price: 10, type: "clothingColor", value: "black" },
    { id: 12, name: "Green Clothes", price: 10, type: "clothingColor", value: "green" },
    { id: 13, name: "Red Clothes", price: 10, type: "clothingColor", value: "red" },
  
    // Graphics
    { id: 14, name: "Vue Graphic", price: 100, type: "graphic", value: "vue" },
    { id: 15, name: "React Graphic", price: 50, type: "graphic", value: "react" },
    { id: 16, name: "Gatsby Graphic", price: 50, type: "graphic", value: "gatsby" },
    { id: 17, name: "Redwood Graphic", price: 50, type: "graphic", value: "redwood" },
  
    // Hair
    { id: 18, name: "Short Hair", price: 40, type: "hair", value: "short" },
    { id: 19, name: "Afro Hair", price: 50, type: "hair", value: "afro" },
    { id: 20, name: "Long Hair", price: 40, type: "hair", value: "long" },
    { id: 21, name: "Pixie Hair", price: 40, type: "hair", value: "pixie" },
  
    // Hair Colors
    { id: 22, name: "Blonde Hair", price: 30, type: "hairColor", value: "blonde" },
    { id: 23, name: "Black Hair", price: 30, type: "hairColor", value: "black" },
    { id: 24, name: "Brown Hair", price: 30, type: "hairColor", value: "brown" },
    { id: 25, name: "Blue Hair", price: 30, type: "hairColor", value: "blue" },
  
    // Hats
    { id: 26, name: "Beanie Hat", price: 20, type: "hat", value: "beanie" },
    { id: 27, name: "Turban Hat", price: 20, type: "hat", value: "turban" },
  
    // Hat Colors
    { id: 28, name: "White Hat", price: 10, type: "hatColor", value: "white" },
    { id: 29, name: "Black Hat", price: 10, type: "hatColor", value: "black" },
  
    // Facial Hair
    { id: 30, name: "Beard", price: 30, type: "facialHair", value: "mediumBeard" },
    { id: 31, name: "Stubble", price: 20, type: "facialHair", value: "stubble" },
  
    // Eyebrows
    { id: 32, name: "Raised Eyebrows", price: 5, type: "eyebrows", value: "raised" },
    { id: 33, name: "Angry Eyebrows", price: 5, type: "eyebrows", value: "angry" },
  
    // Lips
    { id: 34, name: "Red Lips", price: 5, type: "lipColor", value: "red" },
    { id: 35, name: "Pink Lips", price: 5, type: "lipColor", value: "pink" },
  
    // Mouth
    { id: 36, name: "Grin Mouth", price: 5, type: "mouth", value: "grin" },
    { id: 37, name: "Open Smile Mouth", price: 5, type: "mouth", value: "openSmile" },
  ];
  
  // Grouping options into categories
  const categories: Category[] = [
    { name: "Accessories", options: options.filter((opt) => opt.type === "accessory") },
    { name: "Clothing", options: options.filter((opt) => opt.type === "clothing") },
    { name: "Clothing Colors", options: options.filter((opt) => opt.type === "clothingColor") },
    { name: "Graphics", options: options.filter((opt) => opt.type === "graphic") },
    { name: "Hair", options: options.filter((opt) => opt.type === "hair") },
    { name: "Hair Colors", options: options.filter((opt) => opt.type === "hairColor") },
    { name: "Hats", options: options.filter((opt) => opt.type === "hat") },
    { name: "Hat Colors", options: options.filter((opt) => opt.type === "hatColor") },
    { name: "Facial Hair", options: options.filter((opt) => opt.type === "facialHair") },
    { name: "Eyebrows", options: options.filter((opt) => opt.type === "eyebrows") },
    { name: "Lips", options: options.filter((opt) => opt.type === "lipColor") },
    { name: "Mouth", options: options.filter((opt) => opt.type === "mouth") },
  ];

  const defaultAppearance: Partial<AvatarProps> = {
    accessory: "none",
    body: bodyType,
    clothing: "shirt",
    clothingColor: "white",
    eyebrows: "raised",
    eyes: "normal",
    facialHair: "none",
    graphic: "none",
    hair: "none",
    hairColor: "white",
    hat: "none",
    hatColor: undefined,
    lashes: bodyType === "breasts",
    lipColor: "pink",
    mask: true,
    faceMask: false,
    mouth: "serious",
    skinTone: "light",
  };

  const getAppearance = (): Partial<AvatarProps> => {
    const appearance: Partial<AvatarProps> = {
      ...defaultAppearance,
      body: bodyType,
      skinTone,
      lashes: bodyType === "breasts",
    };

    equippedOptions.forEach((optionId) => {
      const option = options.find((o) => o.id === optionId);
      if (option) {
        appearance[option.type] = option.value;
      }
    });

    return appearance;
  };

  const handlePurchase = (optionId: number, price: number) => {
    if (balance < price) {
      alert("Not enough Sofa.King Coins!");
      return;
    }

    if (purchasedOptions.includes(optionId)) {
      alert("You already own this option!");
      return;
    }

    setBalance((prev) => prev - price);
    setPurchasedOptions((prev) => [...prev, optionId]);
    alert("Purchase successful!");
  };

  const toggleEquip = (optionId: number) => {
    if (equippedOptions.includes(optionId)) {
      setEquippedOptions((prev) => prev.filter((id) => id !== optionId));
    } else {
      setEquippedOptions((prev) => [...prev, optionId]);
    }
  };

  const handleSkinToneChange = (newTone: AvatarProps["skinTone"]) => {
    setSkinTone(newTone);
  };

  const handleBodyTypeChange = (newBody: "chest" | "breasts") => {
    setBodyType(newBody);
  };

  return (
    <div className="relative min-h-screen p-8 pb-20 flex flex-col items-center gap-16 bg-black text-white">
      <header className="flex flex-col items-center sm:flex-row sm:justify-between w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-white">Sofa.King Marketplace</h1>
        <div className="mt-6 flex items-center gap-2 text-lg font-bold text-yellow-400">
          <IconWallet />
          <span>Your Balance: {balance} Coins</span>
        </div>
      </header>

      <section className="relative w-64 h-64">
        <BeanHead {...getAppearance()} />
      </section>

      {/* Toggles for Skin Tone and Body Type */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold">Skin Tone:</h3>
          {["light", "yellow", "brown", "dark", "red", "black"].map((tone) => (
            <button
              key={tone}
              onClick={() => handleSkinToneChange(tone as AvatarProps["skinTone"])}
              className={`px-4 py-2 rounded-full font-bold ${
                skinTone === tone ? "bg-green-600 text-white" : "bg-neutral-700 text-gray-300"
              }`}
            >
              {tone.charAt(0).toUpperCase() + tone.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold">Body Type:</h3>
          {["chest", "breasts"].map((body) => (
            <button
              key={body}
              onClick={() => handleBodyTypeChange(body as "chest" | "breasts")}
              className={`px-4 py-2 rounded-full font-bold ${
                bodyType === body ? "bg-green-600 text-white" : "bg-neutral-700 text-gray-300"
              }`}
            >
              {body === "chest" ? "Male" : "Female"}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="flex flex-col gap-4 w-full max-w-4xl">
        {categories.map((category) => (
          <div key={category.name} className="flex flex-col gap-2">
            <button
              onClick={() => setOpenModal(category.name)}
              className="px-4 py-2 rounded-full bg-blue-600 text-white text-lg font-bold hover:bg-blue-700"
            >
              Open {category.name}
            </button>
            {openModal === category.name && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
                <div className="bg-neutral-900 p-6 rounded-lg max-w-2xl w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                    <button
                      onClick={() => setOpenModal(null)}
                      className="text-white text-xl font-bold hover:text-gray-400"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {category.options.map((option) => (
                      <div
                        key={option.id}
                        className="flex flex-col items-center gap-2 p-4 bg-neutral-800 rounded-lg"
                      >
                        <h3 className="text-lg font-bold text-white">{option.name}</h3>
                        <div className="text-yellow-400 text-sm">
                          {option.price > 0 ? `${option.price} Coins` : "Free"}
                        </div>
                        <button
                          onClick={() => {
                            if (purchasedOptions.includes(option.id)) {
                              toggleEquip(option.id);
                            } else {
                              handlePurchase(option.id, option.price);
                            }
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-bold ${
                            equippedOptions.includes(option.id)
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : purchasedOptions.includes(option.id)
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {equippedOptions.includes(option.id)
                            ? "Unequip"
                            : purchasedOptions.includes(option.id)
                            ? "Equip"
                            : "Buy"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>
      {/* Floating Dock */}
      <div className="mt-6 mb-2">
        <FloatingDock />
      </div>
    </div>
  );
}
