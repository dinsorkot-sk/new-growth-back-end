"use client";

const CategoryList = ({ categories, selectedCategory, onSelectCategory }) => {
    // ฟังก์ชันสำหรับการเลือกหรือยกเลิกการเลือกหมวดหมู่
    const handleCategoryClick = (category) => {
        if (selectedCategory?.id === category.id) {
            // ถ้าคลิกที่หมวดหมู่ที่เลือกอยู่แล้ว ให้ยกเลิกการเลือก
            onSelectCategory(null);
        } else {
            // ถ้าคลิกที่หมวดหมู่ใหม่ ให้เลือกหมวดหมู่นั้น
            onSelectCategory(category);
        }
    };
    
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
                <CategoryCard
                    key={category.id}
                    category={category}
                    isSelected={selectedCategory?.id === category.id}
                    onSelect={() => handleCategoryClick(category)}
                />
            ))}
        </div>
    );
};

const CategoryCard = ({ category, isSelected, onSelect }) => {
    return (
        <div 
            className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all 
                ${isSelected 
                    ? 'bg-green-500 text-white border-2 border-green-600' 
                    : 'bg-white border border-gray-200 hover:border-green-400'}`}
            onClick={onSelect}
        >
            <div className="mb-2">
                <div className="w-12 h-12 flex items-center justify-center bg-amber-100 rounded-full">
                    <img 
                        src="/graduation-cap.svg" 
                        alt={category.name}
                        className="w-6 h-6" 
                    />
                </div>
            </div>
            <h3 className="text-center font-medium">ช่องทางคุย</h3>
            <p className="text-xs text-center">{category.name}</p>
        </div>
    );
};

export default CategoryList;