import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { FaMagic } from "react-icons/fa";
import Loading from "../components/UI/Loading";
import uploadImage from "../utils/uploadImage";
import { useSelector } from "react-redux";

const AdminUploadDesign = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const allStyleDesign = useSelector((state) => state.design.allStyleDesign);

  const [tempDesign, setTempDesign] = useState(location.state?.tempDesign || null);
  const [formData, setFormData] = useState({
    name: tempDesign?.name || "Thiết kế mới",
    styleDesign: tempDesign?.styleDesign || [],
    basePrice: tempDesign?.basePrice || 10000,
    tags: tempDesign?.tags || [],
    isPublic: tempDesign?.isPublic || false,
    designId: tempDesign?.designId || null, // Thêm designId vào formData
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (tempDesign) {
      setFormData({
        name: tempDesign.name || "Thiết kế mới",
        styleDesign: tempDesign.styleDesign || [],
        basePrice: tempDesign.basePrice || 10000,
        tags: tempDesign.tags || [],
        isPublic: tempDesign.isPublic || false,
        designId: tempDesign.designId || null, // Cập nhật designId từ tempDesign
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

  const handleStyleChange = (e) => {
    const selectedStyleId = e.target.value;
    if (selectedStyleId && !formData.styleDesign.includes(selectedStyleId)) {
      setFormData((prev) => ({
        ...prev,
        styleDesign: [...prev.styleDesign, selectedStyleId],
      }));
    }
    e.target.value = "";
  };

  const handleRemoveStyle = (styleIdToRemove) => {
    setFormData((prev) => ({
      ...prev,
      styleDesign: prev.styleDesign.filter((id) => id !== styleIdToRemove),
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

    let thumbnailUrl = tempDesign.thumbnail;
    if (thumbnailUrl && thumbnailUrl.startsWith("data:image")) {
      try {
        const blob = await (await fetch(thumbnailUrl)).blob();
        const file = new File([blob], "thumbnail.png", { type: "image/png" });
        const uploadResponse = await uploadImage(file);
        if (uploadResponse.data && uploadResponse.data.success) {
          thumbnailUrl = uploadResponse.data.data.url;
        } else {
          throw new Error("Failed to upload thumbnail");
        }
      } catch (error) {
        console.error("Lỗi khi upload thumbnail:", error);
        toast.error("Không thể upload thumbnail!");
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    const finalDesignData = {
      ...tempDesign,
      name: formData.name,
      styleDesign: formData.styleDesign,
      basePrice: formData.basePrice,
      tags: formData.tags,
      isPublic: formData.isPublic,
      thumbnail: thumbnailUrl,
      designId: formData.designId, // Đảm bảo designId được bao gồm
    };

    // console.log("Dữ liệu gửi đi:", JSON.stringify(finalDesignData, null, 2));

    try {
      let response;
      if (finalDesignData.designId) {
        // Nếu có designId, gọi API updateDesign
        response = await Axios({
          ...SummaryApi.updateDesign,
          data: finalDesignData,
          timeout: 10000,
        });
      } else {
        // Nếu không có designId, gọi API addDesign
        response = await Axios({
          ...SummaryApi.addDesign,
          data: finalDesignData,
          timeout: 10000,
        });
      }

      // console.log("Dữ liệu trả về:", response.data.data);
      if (response.data.success) {
        toast.success(finalDesignData.designId ? "Cập nhật thiết kế thành công!" : "Thiết kế đã được lưu thành công!");
        setTempDesign(null);
        navigate("/dashboard/design");
      } else {
        throw new Error(response.data.message || "Lỗi không xác định");
      }
    } catch (error) {
      console.error("Lỗi khi lưu thiết kế:", error);
      if (error.response && error.response.data) {
        console.log("Chi tiết lỗi từ server:", error.response.data);
        toast.error(`Không thể lưu thiết kế: ${error.response.data.message || error.message}`);
      } else {
        toast.error("Không thể lưu thiết kế: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const editDesign = () => {
    const designToEdit = {
      ...tempDesign,
      name: formData.name,
      styleDesign: formData.styleDesign,
      basePrice: formData.basePrice,
      tags: formData.tags,
      isPublic: formData.isPublic,
      _id: formData.designId
    };
    navigate("/design", { state: { designToEdit } });
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3 shadow-md p-3">
        <h2 className="font-semibold text-lg">Tạo Thiết Kế</h2>
      </div>

      <div className="p-4 bg-white shadow-md rounded-md mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tempDesign ? (
            <div className="grid justify-center">
              {tempDesign.thumbnail ? (
                <img
                  src={tempDesign.thumbnail}
                  alt="Design Thumbnail"
                  style={{ maxWidth: "400px", maxHeight: "500px" }}
                  className="border border-dotted"
                />
              ) : (
                <p>Không có ảnh thumbnail</p>
              )}
              <button
                onClick={editDesign}
                className="mt-4 bg-white border border-gray-300 px-4 py-2 rounded hover:bg-yellow-500 hover:text-white w-full"
              >
                Sửa
              </button>
            </div>
          ) : (
            <div
              onClick={() => navigate("/design")}
              className="p-4 bg-white text-amber-200 animate-pulse shadow-md rounded-md mb-4 flex flex-col items-center justify-center"
            >
              <div>
                <FaMagic size={40} />
              </div>
            </div>
          )}
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

            <div className="grid gap-1">
              <label className="block text-sm font-medium">Phong cách</label>
              <select
                name="styleDesign"
                id="styleDesign"
                className="w-full p-2 border rounded-md"
                onChange={handleStyleChange}
              >
                <option value="">Chọn phong cách</option>
                {allStyleDesign.map((style) => (
                  <option key={style._id} value={style._id}>
                    {style.name}
                  </option>
                ))}
              </select>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.styleDesign.map((styleId) => {
                  const style = allStyleDesign.find((s) => s._id === styleId);
                  return (
                    <span
                      key={styleId}
                      className="bg-gray-200 px-2 py-1 rounded-md text-sm flex items-center"
                    >
                      {style?.name || "Unknown"}
                      <button
                        onClick={() => handleRemoveStyle(styleId)}
                        className="ml-1 text-red-500"
                      >
                        x
                      </button>
                    </span>
                  );
                })}
              </div>
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
                    setFormData((prev) => ({
                      ...prev,
                      isPublic: e.target.checked,
                    }))
                  }
                />
                Công khai thiết kế
              </label>
            </div>

            <button
              className={`
                w-full h-12 p-2 text-sm px-3 flex items-center justify-center font-semibold rounded-md
                ${tempDesign
                  ? "bg-primary hover:text-white hover:bg-primary-darker"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"}
              `}
              onClick={saveFinalDesign}
              disabled={loading || !tempDesign}
            >
              {loading ? (
                <Loading size="small" />
              ) : formData.designId ? (
                "Cập nhật thiết kế"
              ) : (
                "Lưu thiết kế"
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminUploadDesign;