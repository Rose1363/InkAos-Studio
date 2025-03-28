import React from "react";

const BorderWidthSetting = ({ selectedObject, updateObject }) => {
  // Xử lý thay đổi kích thước viền (strokeWidth)
  const handleStrokeWidthChange = (e) => {
    const value = e.target.value;
    // Chuyển đổi thành số, nếu không hợp lệ thì đặt về 0
    const strokeWidth = value === "" ? 0 : Number(value);
    updateObject({ strokeWidth });
  };

  // Đảm bảo selectedObject có các thuộc tính cần thiết
  if (!selectedObject) return null;

  return (
    <div className="mt-2">
      <label className="block">Border Width</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          name="strokeWidth"
          min="1"
          max="10"
          value={selectedObject.strokeWidth || 2}
          onChange={handleStrokeWidthChange}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
};

export default BorderWidthSetting;