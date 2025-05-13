import React, { useEffect, useState } from 'react';

type Props = {
    selectedItem: string;
    setSelectedItem: (value: string) => void;
}

const DropdownSelector: React.FC<Props> = ({ selectedItem, setSelectedItem }) => {
    let [items, setItems] = useState<string[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedItem(event.target.value);
    };

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/productTypes?limit=2000`);
                const data = await response.json();
                const productNames = data.docs.map((item: any) => item.productName);
                setItems(productNames);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, []);

    return (
        <div>
            <label htmlFor="dropdown">Select an item:</label>
            <select id="dropdown" value={selectedItem} onChange={handleChange}>
                <option value="">
                    None
                </option>
                {items.map((item, index) => (
                    <option key={index} value={item}>
                        {item}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DropdownSelector;