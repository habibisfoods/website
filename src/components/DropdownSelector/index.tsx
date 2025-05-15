import React, { useEffect, useState } from 'react'

type Props = {
  selectedItem: string
  setSelectedItem: (value: string) => void
}

const DropdownSelector: React.FC<Props> = ({ selectedItem, setSelectedItem }) => {
  const [items, setItems] = useState<string[]>([])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedItem(event.target.value)
  }

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/productTypes?limit=2000`,
        )
        const data = await response.json()
        const productNames = data.docs.map((item: any) => item.productType)
        setItems(productNames)
      } catch (error) {
        console.error('Error fetching items:', error)
      }
    }

    fetchItems()
  }, [])

  return (
    <div className="flex flex-col gap-2 w-full max-w-xs">
      {/* <label htmlFor="dropdown" className="text-sm font-medium text-gray-700">
                Item Filter:
            </label> */}
      <select
        id="dropdown"
        value={selectedItem}
        onChange={handleChange}
        className="px-3 py-1 rounded-2xl bg-white border border-gray-300 shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      >
        <option value="" disabled hidden>
          Products
        </option>
        <option value="">All</option>
        {items.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  )
}

export default DropdownSelector
