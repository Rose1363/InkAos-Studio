import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { Stage, Layer, Text, Image } from "react-konva";

const AdminDesignList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tempDesign, setTempDesign] = useState(location.state?.tempDesign || null);
  const [formData, setFormData] = useState({
    name: tempDesign?.name || "Thiết kế mới",
    style: tempDesign?.style || "casual",
    basePrice: tempDesign?.basePrice || 0,
    tags: tempDesign?.tags || [],
    isPublic: tempDesign?.isPublic || false,
  });
  const [tagInput, setTagInput] = useState("");
  const [imageObjects, setImageObjects] = useState({});

  // Tải hình ảnh cho các đối tượng "image"
  useEffect(() => {
    if (tempDesign?.elements) {
      const imageElements = tempDesign.elements.filter((el) => el.type === "image");
      imageElements.forEach((el) => {
        const img = new window.Image();
        img.src = el.imageUrl;
        img.onload = () => {
          setImageObjects((prev) => ({ ...prev, [el.imageUrl]: img }));
        };
      });
    }
  }, [tempDesign]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "basePrice" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() && formData.tags.length < 10) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const saveFinalDesign = async () => {
    if (!tempDesign) {
      toast.error("Không có thiết kế để lưu!");
      return;
    }

    const finalDesignData = {
      ...tempDesign,
      name: formData.name,
      style: formData.style,
      basePrice: formData.basePrice,
      tags: formData.tags,
      isPublic: formData.isPublic,
    };

    try {
      const response = await Axios({
        ...SummaryApi.addDesign,
        data: finalDesignData,
        timeout: 10000,
      });

      if (response.data.success) {
        toast.success("Thiết kế đã được lưu thành công!");
        setDesigns((prev) => [response.data.data, ...prev]);
        setTempDesign(null);
      } else {
        throw new Error(response.data.message || "Lỗi không xác định");
      }
    } catch (error) {
      console.error("Lỗi khi lưu thiết kế:", error);
      toast.error("Không thể lưu thiết kế");
    }
  };

  const editDesign = () => {
    const designToEdit = {
      ...tempDesign,
      name: formData.name,
      style: formData.style,
      basePrice: formData.basePrice,
      tags: formData.tags,
      isPublic: formData.isPublic,
    };
    navigate("/design", { state: { designToEdit } });
  };

  // Tính toán tỷ lệ và vị trí giống Design.jsx
  const baseContainerWidth = 900;
  const containerWidth = baseContainerWidth;
  const canvasWidth = containerWidth * 0.5375;
  const canvasHeight = 500;
  const scaleFactor = canvasWidth / (tempDesign?.canvasWidth || 400); // Tỷ lệ thu nhỏ

  return (
    <section>
      <div className="flex items-center justify-between mb-3 shadow-md p-3">
        <h2 className="font-semibold text-lg">Danh Sách Thiết Kế</h2>
        <button
          onClick={() => navigate("/design")}
          className="bg-primary p-2 text-sm px-3 hover:text-white font-semibold rounded-md hover:bg-primary-darker"
        >
          Tạo Thiết Kế
        </button>
      </div>

      {tempDesign && (
        <div className="p-4 bg-white shadow-md rounded-md mb-4">
          <h3 className="text-md font-semibold mb-2">Hoàn thiện thiết kế</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Canvas hiển thị thiết kế */}
           <div className="flex flex-col justify-center items-center">
           <div className="flex flex-col justify-center items-center">
              <Stage
                width={tempDesign.canvasWidth || 400}
                height={tempDesign.canvasHeight || 500}
                scaleX={scaleFactor}
                scaleY={scaleFactor}
                style={{
                  border: "1px dashed gray",
                  backgroundColor: "#f0f0f0",
                }}
              >
                <Layer>
                  {tempDesign.elements && tempDesign.elements.length > 0 ? (
                    tempDesign.elements.map((element, index) => {
                      if (element.type === "text") {
                        return (
                          <Text
                            key={index}
                            x={element.x || 0}
                            y={element.y || 0}
                            text={element.text}
                            fontSize={element.fontSize || 20}
                            fontFamily={element.fontFamily || "Arial"}
                            fill={element.fill || "#000000"}
                            align={element.align || "left"}
                            fontStyle={element.fontStyle || "normal"}
                            textDecoration={element.textDecoration || "none"}
                            rotation={element.rotation || 0}
                            scaleX={element.scaleX || 1}
                            scaleY={element.scaleY || 1}
                          />
                        );
                      } else if (element.type === "image" && imageObjects[element.imageUrl]) {
                        return (
                          <Image
                            key={index}
                            image={imageObjects[element.imageUrl]}
                            x={element.x || 0}
                            y={element.y || 0}
                            width={element.width || 100}
                            height={element.height || 100}
                            scaleX={element.scaleX || 1}
                            scaleY={element.scaleY || 1}
                            rotation={element.rotation || 0}
                          />
                        );
                      }
                      return null;
                    })
                  ) : (
                    <Text
                      x={100}
                      y={200}
                      text="Không có nội dung để hiển thị"
                      fontSize={20}
                      fill="#666"
                    />
                  )}
                </Layer>
              </Stage>
              
              <button
                  onClick={editDesign}
                  className="mt-4 bg-white border border-gray-300 px-4 py-2 rounded hover:bg-yellow-500 hover:text-white w-full"
                >
                  Sửa
                </button>
              
            </div>
            
           </div>

            {/* Form thông tin */}
            <div className="grid grid-cols-1 gap-4 p-4 border-l border-gray-400">
              <div>
                <label className="block text-sm font-medium">Tên thiết kế</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Nhập tên thiết kế"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Phong cách</label>
                <select
                  name="style"
                  value={formData.style}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="horror">Horror</option>
                  <option value="funny">Funny</option>
                  <option value="cute">Cute</option>
                  <option value="minimalist">Minimalist</option>
                  <option value="vintage">Vintage</option>
                  <option value="sport">Sport</option>
                  <option value="casual">Casual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Giá cơ bản</label>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  min="0"
                  max="1000000"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Tags (tối đa 10)</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full p-2 border rounded-md"
                  placeholder="Nhấn Enter để thêm tag"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-200 px-2 py-1 rounded-md text-sm flex items-center"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-red-500"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isPublic: e.target.checked }))
                    }
                  />
                  Công khai thiết kế
                </label>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={saveFinalDesign}
                  className=" w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Luu thiet ke
                </button>
             
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-white shadow-md rounded-md">
        {loading ? (
          <p>Đang tải...</p>
        ) : designs.length === 0 ? (
          <p>Chưa có thiết kế nào</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Tên</th>
                <th className="border p-2 text-left">Phong cách</th>
                <th className="border p-2 text-left">Giá</th>
                <th className="border p-2 text-left">Công khai</th>
                <th className="border p-2 text-left">Tags</th>
              </tr>
            </thead>
            <tbody>
              {designs.map((design) => (
                <tr key={design._id} className="hover:bg-gray-50">
                  <td className="border p-2">{design.name}</td>
                  <td className="border p-2">{design.style}</td>
                  <td className="border p-2">{design.basePrice}</td>
                  <td className="border p-2">{design.isPublic ? "Có" : "Không"}</td>
                  <td className="border p-2">
                    {Array.isArray(design.tags) ? design.tags.join(", ") : "Không có tags"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default AdminDesignList;