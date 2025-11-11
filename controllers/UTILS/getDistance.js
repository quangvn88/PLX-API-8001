const geolib = require("geolib");

// API: /api/distance?lat1=...&lon1=...&lat2=...&lon2=...
const getDistance = function (req, res){
  const { lat1, lon1, lat2, lon2 } = req.query;

  if (!lat1 || !lon1 || !lat2 || !lon2) {
    return res.status(400).json({ message: "Thiếu tham số tọa độ!" });
  }

  // Tính khoảng cách (mét)
  const distance = geolib.getDistance(
    { latitude: parseFloat(lat1), longitude: parseFloat(lon1) },
    { latitude: parseFloat(lat2), longitude: parseFloat(lon2) }
  );

  // Trả về JSON kết quả
  res.json({
    DISTANCE_M: distance,
    DISTANCE_KM: (distance / 1000).toFixed(2),
  });
};

module.exports = { getDistance };
