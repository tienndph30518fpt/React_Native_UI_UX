import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Button,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Modal } from "react-native";
import { TouchableOpacity } from "react-native";

const Home = () => {
  const [data, setdata] = useState([]);

  const [name, setname] = useState("");
  const [date, setdate] = useState("");
  const [image, setimage] = useState("");
  const [price, setprice] = useState("");

  const [selectItem, setselectItem] = useState(null);
  const [isVisibolModel, setisVisibolModel] = useState(false);
  const [isVisibolModelSua, setisVisibolModelSua] = useState(false);
  // Tạo state để lưu trạng thái tìm kiếm
  const [searchResults, setSearchResults] = useState([]);
  const [sarch, setstarch] = useState("");

  const loadData = async () => {
    const uri = "https://6533dd8ce1b6f4c590465544.mockapi.io/thongtin";

    try {
      const reponse = await fetch(uri);
      const json = await reponse.json();
      setdata(json);
      console.log("Lấy Dữ Liệu Thành Công", json);
    } catch (error) {
      console.log("ERR load Dữ liệu", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // thêm nội dung
  const themThongTin = () => {
    if (name.length === 0) {
      alert("bạn Chưa Nhập Tên");
      return;
    } else if (price.length === 0) {
      alert("bạn Chưa Nhập Tiền");
      return;
    } else if (image.length === 0) {
      alert("bạn Chưa Nhập Link Image");
      return;
    } else if (date.length === 0 || !isValidDateFormat(date)) {
      alert(
        "Định dạng Ngày hết hạn không hợp lệ. Sử dụng định dạng yyyy-mm-dd (ví dụ: '2023-12-31')."
      );
      return;
    }
    let obj = {
      name: name,
      avatar: image,
      price: price,
      date: date,
    };
    const uri = "https://6533dd8ce1b6f4c590465544.mockapi.io/thongtin";
    fetch(uri, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((res) => {
        if (res.status == 201) {
          alert("Thêm Thành Công");
          loadData();
          setisVisibolModel(false);
        } else {
          alert("Thêm Thất Bại");
        }
      })
      .catch((Error) => {
        console.log("ERR", Error);
      });
  };

  // validate định dạng ngày tháng
  const isValidDateFormat = (dateString) => {
    const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
    return dateFormat.test(dateString);
  };

  // sua thong tin
  const SuaThongTin = () => {
    if (selectItem) {
      if (name.length == 0) {
        alert("bạn Chưa Nhập Tên");
        return;
      } else if (price.length == 0) {
        alert("bạn Chưa Nhập Tiền");
        return;
      } else if (image.length == 0) {
        alert("bạn Chưa Nhập Link Image");
        return;
      } else if (date.length === 0 || !isValidDateFormat(date)) {
        alert("Định dạng Ngày hết hạn không hợp lệ. Sử dụng định dạng yyyy-mm-dd ");
        return;
      }

      let obj = {
        name: name,
        avatar: image,
        price: price,
        date: date,
      };
      const uri =
        "https://6533dd8ce1b6f4c590465544.mockapi.io/thongtin/" + selectItem.id;
      fetch(uri, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      })
        .then((res) => {
          if (res.status == 200) {
            alert("Sửa Thành Công");
            loadData();
            setisVisibolModelSua(false);
          } else {
            alert("Sửa Thất Bại");
          }
        })
        .catch((Error) => {
          console.log("ERR", Error);
        });
    }
  };

  // tìm kiếm
  const performSearch = async () => {
    const searchURL = `https://6533dd8ce1b6f4c590465544.mockapi.io/thongtin?search=${sarch}`;
    console.log("tìm Kiếm", searchURL);
    try {
      const response = await fetch(searchURL);
      if (response.ok) {
        const jsonData = await response.json();
        console.log("dữ liệu tìm kiếm", jsonData);
        setSearchResults(jsonData); // Cập nhật dữ liệu tìm kiếm
      } else {
        console.error("Lỗi khi lấy dữ liệu từ API:", response.status);
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const renderItem = ({ item }) => {
    const xoaItem = () => {
      Alert.alert("Thông Báo", "Bạn Có Muốn Xoá Không", [
        {
          text: "Xoá",
          onPress: () => {
            const uri =
              "https://6533dd8ce1b6f4c590465544.mockapi.io/thongtin/" + item.id;
            fetch(uri, {
              method: "DELETE",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            })
              .then((res) => {
                if (res.status == 200) {
                  alert("Xoá Thành Công");
                  loadData();
                } else {
                  alert("Xoá Thất Bại");
                }
              })
              .catch((Error) => {
                console.log("ERR", Error);
              });
          },
        },
        {
          text: "Huỷ",
          style: "cancel",
        },
      ]);
    };

    const hienThiChiTiet = () => {
      Alert.alert(
        "Thông Tin Chi Tiết",
        `Tên: ${item.name} \n Tiền: ${item.price} \n Ngày : ${item.createdAt} \n Ngày Hết Hạn: ${item.date} \n Link Ảnh: ${item.avatar}`
      );
    };

    const slecctItem = () => {
      setselectItem(item);
      setimage(item.avatar);
      setname(item.name);
      setprice(item.price.toString());
      setdate(item.date.toString());
      setisVisibolModelSua(true);
    };
    return (
      <View
        style={{
          flexDirection: "row",
          margin: 10,
          backgroundColor: "#E8E8E8",
          borderRadius: 20,
        }}
      >
        <View style={{ flex: 1, margin: 10 }}>
          <Text>Tên: {item.name}</Text>
          <Text>Giá: {item.price}</Text>
          <Text>Thời Gian: {item.createdAt}</Text>
          <Text>Thời Hết Hạn: {item.date}</Text>
          <TouchableOpacity onPress={hienThiChiTiet}>
            <Text style={{ color: "#f45" }}>Xem chi Tiết</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <TouchableOpacity
              style={{
                marginRight: 20,
                borderWidth: 1,
                borderColor: "green",
                borderRadius: 5,
              }}
              onPress={() => slecctItem()}
            >
              <Text style={{ color: "green" }}>Sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ borderWidth: 1, borderColor: "red", borderRadius: 5 }}
              onPress={xoaItem}
            >
              <Text style={{ color: "red" }}>Xoá</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => hienThiChiTiet(item)}>
          <Image
            style={{ width: 50, height: 50, margin: 30 }}
            source={{ uri: item.avatar }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ marginTop: 20, flex: 1 }}>
      <View>
        {/* <TouchableOpacity onPress={performSearch}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Nhập Nội Dung Tìm Kiếm"
                onChangeText={(text) => setstarch(text)}
              />
              <Image
                style={styles.searchIcon}
                source={require("../assets/search.png")}
              />
            </View>
          </TouchableOpacity> */}
      </View>

      <Button title="Thêm" onPress={() => setisVisibolModel(true)} />

      <FlatList
        data={searchResults.length > 0 ? searchResults : data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <Modal
        visible={isVisibolModel}
        onRequestClose={() => setisVisibolModel(false)}
      >
        <View style={styles.contenModel}>
          <View style={styles.itemModel}>
            <Text
              style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
            >
              Thêm Thông Tin
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập Vào Tên..."
              onChangeText={(text) => setname(text)}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Nhập Vào Giá..."
              keyboardType="numeric"
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, "");
                setprice(numericValue);
              }}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Nhập Vào Link Ảnhe..."
              onChangeText={(text) => setimage(text)}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Nhập Vào Ngày Hết Hạn..."
              onChangeText={(text) => setdate(text)}
            />

            <Button
              title="Thêm Mới "
              color="green"
              onPress={() => {
                themThongTin();
                // setisVisibolModel(false);
              }}
            />
            <View style={{ margin: 10 }}></View>
            <Button
              style={{ marginTop: 20 }}
              title="Huỷ"
              color="red"
              onPress={() => {
                setisVisibolModel(false);
              }}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={isVisibolModelSua}
        onRequestClose={() => setisVisibolModelSua(false)}
      >
        <View style={styles.contenModel}>
          <View style={styles.itemModel}>
            <Text
              style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
            >
              Sửa Thông Tin
            </Text>
            <TextInput
              editable={false}
              value={name}
              style={styles.textInput}
              placeholder="Nhập Vào Tên..."
              onChangeText={(text) => setname(text)}
            />
            <TextInput
              value={price}
              style={styles.textInput}
              placeholder="Nhập Vào Giá..."
              keyboardType="numeric"
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, "");
                setprice(numericValue);
              }}
            />
            <TextInput
              value={image}
              style={styles.textInput}
              placeholder="Nhập Vào Link Ảnhe..."
              onChangeText={(text) => setimage(text)}
            />

            <TextInput
              style={styles.textInput}
              value={date}
              placeholder="Nhập Vào Ngày Hết Hạn..."
              onChangeText={(text) => setdate(text)}
            />

            <Button
              title="Sửa "
              color="green"
              onPress={() => {
                SuaThongTin();
                // setisVisibolModelSua(false);
              }}
            />

            <View style={{ margin: 10 }}></View>
            <Button
              title="Huỷ"
              color="red"
              onPress={() => {
                setisVisibolModelSua(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  contenModel: {
    backgroundColor: "black",
    opacity: 0.8,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemModel: {
    width: 400,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  textInput: {
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  searchIcon: {
    width: 40,
    height: 40,
  },
  searchContainer: {
    flexDirection: "row",
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 20,
    width: 400,
  },
});
