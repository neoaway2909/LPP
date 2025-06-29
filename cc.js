// เก็บออเดอร์ปัจจุบันและข้อมูลโต๊ะ
let order = {};
const tableData = {};
let currentTable = 1;

// สร้างรายการโต๊ะ
const dropdown = document.getElementById("tableDropdown");
const tableLabel = document.getElementById("currentTableLabel");
for (let i = 1; i <= 37; i++) {
  const btn = document.createElement("button");
  btn.textContent = `โต๊ะ ${i}`;
  btn.onclick = () => switchTable(i);
  dropdown.appendChild(btn);
}

function toggleTableDropdown() {
  dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
}

function switchTable(tableNumber) {
  saveCurrentOrder();
  currentTable = tableNumber;
  loadCurrentOrder();
  tableLabel.textContent = currentTable;
  dropdown.style.display = "none";
  saveDataToStorage();  // บันทึกข้อมูลลง localStorage
}

function saveCurrentOrder() {
  tableData[currentTable] = JSON.parse(JSON.stringify(order));
}

function loadCurrentOrder() {
  order = tableData[currentTable] || {};
  updateSummary();
  renderMenu("food", currentFoodPage);   // 👈 ต้องเรียกใหม่เพื่อโหลดราคาล่าสุด
  renderMenu("drink", currentDrinkPage);
}

function showPage(page, event) {
    saveCurrentOrder(); // 👈 สำคัญ!
  document.querySelectorAll(".menu-page").forEach((el) => el.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
  document.getElementById(page).classList.add("active");
  event.target.classList.add("active");
  loadCurrentOrder(); // โหลด order อีกครั้ง
}

function addItem(name) {
  let price = 0;

  // ถ้ามี input ราคาจริงๆ ให้ใช้ราคานั้น
  const input = document.getElementById(`price-${name}`);
  if (input) {
    price = parseFloat(input.value);
    if (isNaN(price)) price = 0;
  }

  // ถ้าไม่มี input หรือราคาไม่ถูกต้อง ให้ใช้ getPrice() ที่อ่านจาก localStorage หรือราคาเริ่มต้น
  if (price === 0) {
    const menuItem = findMenuItemByName(name);
    if (menuItem) {
      price = getPrice(menuItem);
    }
  }

  if (!order[name]) {
    order[name] = { qty: 1, price };
  } else {
    order[name].qty += 1;
    order[name].price = price;
  }
  updateSummary();
  saveDataToStorage();
}

function findMenuItemByName(name) {
  for (const type in menuData) {
    for (const page of menuData[type]) {
      for (const item of page) {
        if (item.name === name) {
          return item;
        }
      }
    }
  }
  return null;
}

function removeItem(name) {
  if (order[name]) {
    order[name].qty -= 1;
    if (order[name].qty <= 0) delete order[name];
    updateSummary();
    saveDataToStorage();  // บันทึกข้อมูลลง localStorage
  }
}

function updateSummary() {
  const list = document.getElementById("order-list");
  const total = document.getElementById("total");
  list.innerHTML = "";
  let sum = 0;

  for (let item in order) {
    const itemData = order[item];

    // ✅ ใช้ getPrice() เพื่อดึงราคาปัจจุบันที่อาจมีการอัปเดต
    const currentPrice = getPrice({ name: item, price: itemData.price });
    const itemTotal = itemData.qty * currentPrice;
    sum += itemTotal;

    const li = document.createElement("li");
    li.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>${item}</span>
        <div style="display: flex; align-items: center; gap: 5px;">
          <button class="order-summary-button remove" onclick="removeItem('${item}')">-</button>
          <span class="order-summary-qty">${itemData.qty}</span>
          <button class="order-summary-button" onclick="addItem('${item}')">+</button>
          <span>= ฿${itemTotal}</span>
        </div>
      </div>
    `;
    list.appendChild(li);
  }

  total.textContent = `฿${sum}`;
}


const menuData = {
    food: [
      [
        { name: "ลาบเป็ด", price: 70, image: "tom.jpg" },
        { name: "ลาบเนื้อสุก", price: 90, image: "tom.jpg" },
        { name: "ก้อยดิบ", price: 90, image: "tom.jpg" },
        { name: "น้ำตกคอหมู", price: 90, image: "tom.jpg" },
        { name: "น้ำตกเนื้อ", price: 100, image: "tom.jpg" },
        { name: "เนื้อย่าง", price: 120, image: "tom.jpg" },
        { name: "ยำเนื้อย่าง", price: 100, image: "tom.jpg" },
        { name: "ยำรวมมิตร", price: 90, image: "tom.jpg" },
        { name: "ยำวุ้นเส้น", price: 100, image: "tom.jpg" },
      ],
      [
        { name: "ยำกุ้ง-ปลาหมึก", price: 120, image: "tom.jpg" },
        { name: "ยำไข่ดาวหมูสับ", price: 80, image: "tom.jpg" },
        { name: "ยำไข่ดาวกุ้งสับ", price: 90, image: "tom.jpg" },
        { name: "ยำหมูยอ/ยำไส้กรอก", price: 70, image: "tom.jpg" },
        { name: "ยำคอหมูย่าง", price: 90, image: "tom.jpg" },
        { name: "กุ้งแช่น้ำปลา", price: 80, image: "tom.jpg" },
        { name: "คอหมูย่าง", price: 80, image: "tom.jpg" },
        { name: "ยำเล็บมือนาง", price: 90, image: "tom.jpg" },
   
      ],
      [
        { name: "ยำปลากระป๋อง", price: 50, image: "tom.jpg" },
        { name: "ยำไข่เยี่ยวม้าหมูสับ", price: 70, image: "tom.jpg" },
        { name: "ยำไข่เยี่ยวม้ากุ้งสับ", price: 80, image: "tom.jpg" },
        { name: "ไข่เยี่ยวม้าขิงดอง", price: 50, image: "tom.jpg" },
        { name: "ไข้เยี่ยวม้าทรงเครื่อง", price: 100, image: "tom.jpg" },
      ],
      [
        { name: "ตำปาร้า-ตำปู-ปลาร้า", price: 50, image: "tom.jpg" },
        { name: "ตำซั่ว-ตำขนมจีน", price: 50, image: "tom.jpg" },
        { name: "ตำไทย", price: 50, image: "tom.jpg" },
        { name: "ตำไทยไข่เค็ม", price: 60, image: "tom.jpg" },
        { name: "ตำปู", price: 50, image: "tom.jpg" },
        { name: "ตำโคราช", price: 60, image: "tom.jpg" },
        { name: "ตำข้าวโพดไข่เค็ม", price: 70, image: "tom.jpg" },
        { name: "ตำแตง-ตำถั่ว", price: 60, image: "tom.jpg" },
        { name: "ตำคอหมู,ตำหมูยอ,ตำกุ้งสด", price: 70, image: "tom.jpg" },
      ],
      [
        { name: "ซุปหม่อไม้", price: 50, image: "tom.jpg" },
        { name: "หมูแดดเดียว", price: 90, image: "tom.jpg" },
        { name: "เนื้อแดด", price: 100, image: "tom.jpg" },
        { name: "ปีกไก่ทอด", price: 60, image: "tom.jpg" },
        { name: "แหนมสันคอหมูทอด", price: 90, image: "tom.jpg" },
        { name: "ไข่เจียว", price: 50, image: "tom.jpg" },
        { name: "ไข่เจียวหมูสับ", price: 60, image: "tom.jpg" },
        { name: "ปากเป็ดทอด", price: 70, image: "tom.jpg" },
      ],
      [
        { name: "ต้มแซ่บเล้ง", price: 80, image: "tom.jpg" },
        { name: "ต้มกระดูกอ่อน", price: 90, image: "tom.jpg" },
        { name: "ต้มเนื้อ", price: 80, image: "tom.jpg" },
        { name: "ต้มเครื่องใน", price: 80, image: "tom.jpg" },
        { name: "ต้มเอ็นแก้ว", price: 100, image: "tom.jpg" },
        { name: "เครื่องในลวกจิ้ม", price: 80, image: "tom.jpg" },
        { name: "เอ็นแก้วลวกจิ้ม", price: 100, image: "tom.jpg" },
        { name: "อ่อมไก่", price: 80, image: "tom.jpg" },
      ], [
        { name: "ยำถั่ว", price: 40, image: "tom.jpg" },
        { name: "ยำเม็ดม่วง", price: 80, image: "tom.jpg" },
        { name: "แหนมทรงเครื่อง", price: 50, image: "tom.jpg" },
        { name: "ข้าวเกรียบ", price: 50, image: "tom.jpg" },
        { name: "เฟรนฟราย", price: 60, image: "tom.jpg" },
        { name: "ข้าวสวย", price: 10, image: "tom.jpg" },
        { name: "ข้าวเหนียว", price: 10, image: "tom.jpg" },
        { name: "ขนมจีน", price: 10, image: "tom.jpg" },
      ],
      [
        { name: "พิเศษ", price: 5, image: "tom.jpg" },
        { name: "พิเศษ", price: 10, image: "tom.jpg" },
        { name: "พิเศษ", price: 15, image: "tom.jpg" },
        { name: "พิเศษ", price: 20, image: "tom.jpg" },
      ],
      // หน้า 2, 3... ใส่รายการอื่นได้ตามต้องการ
    ],
    drink: [
      [
        { name: "โค้ก", price: 25, image: "tom.jpg" },
        { name: "โซดา", price: 25, image: "tom.jpg" },
        { name: "แข็งเล็ก", price: 25, image: "tom.jpg" },
        { name: "แข็งใหญ่", price: 50, image: "tom.jpg" },
        { name: "เปิดเหล้าแบน", price: 40, image: "tom.jpg" },
        { name: "เปิดเหล้ากลม", price: 80, image: "tom.jpg" },
        { name: "เปิดไวน์+ถังแช่", price: 100, image: "tom.jpg" },
      ],
      [
        { name: "ลีโอ", price: 90, image: "tom.jpg" },
        { name: "ช้าง", price: 90, image: "tom.jpg" },
        { name: "สิงห์", price: 95, image: "tom.jpg" },
        { name: "ไฮนาเก้น", price: 100, image: "tom.jpg" },
        { name: "รีเจนซี่ แบน", price: 480, image: "tom.jpg" },
        { name: "แสงโสม แบน", price: 190, image: "tom.jpg" },
        { name: "แสงโสมกลม", price: 390, image: "tom.jpg" },
        { name: "หงส์ แบน", price: 190, image: "tom.jpg" },
        { name: "หงส์ กลม", price: 350, image: "tom.jpg" },
      ],
      [
        { name: "เบลนด์285 ดำ", price: 360, image: "tom.jpg" },
        { name: "เบลนด์285 ทอง", price: 400, image: "tom.jpg" },
        { name: "วูฟ แบน", price: 190, image: "tom.jpg" },
        { name: "วูฟ กลม", price: 390, image: "tom.jpg" },
        { name: "สปาย", price: 50, image: "tom.jpg" },
        { name: "โฮกาเด้น", price: 130, image: "tom.jpg" },
      ],
    ],
  };
  

let currentFoodPage = 0;
let currentDrinkPage = 0;
 
function toSafeKey(name) {
  return encodeURIComponent(name);
}

function getPrice(menuItem) {
  const key = `price_${toSafeKey(menuItem.name)}`;
  const saved = localStorage.getItem(key);
  const parsed = parseFloat(saved);
  return isNaN(parsed) ? menuItem.price : parsed;
}

function setPrice(menuItem, newPrice) {
  const key = `price_${toSafeKey(menuItem.name)}`;
  localStorage.setItem(key, newPrice);
  menuItem.price = newPrice;
}


function updateItemPrice(name, newPrice) {
  newPrice = parseFloat(newPrice);
  if (isNaN(newPrice)) return;

  const safeKey = `price_${toSafeKey(name)}`;

  // อัปเดตในเมนู
  const allItems = menuData.food.flat().concat(menuData.drink.flat());
  const targetItem = allItems.find(item => item.name === name);
  if (targetItem) {
    targetItem.price = newPrice;
    localStorage.setItem(safeKey, newPrice);
  }

  if (order[name]) {
    order[name].price = newPrice;
  } else {
    order[name] = { qty: 0, price: newPrice };
  }

  updateSummary();
  saveDataToStorage();
}


// ดึงราคาที่แก้ไขจาก localStorage (ถ้ามี)
window.addEventListener("DOMContentLoaded", () => {
  loadDataFromStorage();   
  loadCustomMenuData();
  renderMenu("food", currentFoodPage);
  renderMenu("drink", currentDrinkPage);
  renderCustomItems();

  // ✅ ดึงราคาใหม่ของลาบเป็ด
  const priceToShow = getPrice(menuData.food[0][0]);
  console.log(`ราคาลาบเป็ด: ${priceToShow} บาท`);

  // ✅ วนลูปแสดงชื่อและราคาทั้งหมด
  menuData.food.forEach(page => {
    page.forEach(item => {
      const price = getPrice(item);
      console.log(`${item.name}: ${price} บาท`);

      // ตัวอย่าง: อัปเดตราคาลาบเป็ด
      // if(item.name === "ลาบเป็ด") setPrice(item, 90);
    });
  });
});


function renderMenu(type, page) {
  const container = document.getElementById(`${type}-menu`);
  const pagination = document.getElementById(`${type}-pagination`);
  const menu = menuData[type][page];
  console.log('Rendering menu:', type, 'page:', page, 'items:', menu.length);

  container.innerHTML = "";
  menu.forEach((item) => {
    const imgSrc = item.image || "images/placeholder.jpg";
    const itemPrice = getPrice(item); // ✅ ใช้ราคาจาก LocalStorage

    const div = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `
    <img src="${imgSrc}" alt="${item.name}" />
    <span>${item.name}</span>
<input type="number" 
       id="price-${toSafeKey(item.name)}" 
       value="${itemPrice}" 
       style="width:50px; font-size:0.9em;" 
       onchange="updateItemPrice('${item.name}', this.value)" />

    <div class="controls">
      <button onclick="addItem('${item.name}')">+</button>
      <button class="remove" onclick="removeItem('${item.name}')">-</button>
    </div>
  `;
  
    container.appendChild(div);
  });

  pagination.innerHTML = "";
  menuData[type].forEach((_, i) => {
    const btn = document.createElement("button");
    btn.textContent = i + 1;
    btn.className = i === page ? "active" : "";
    btn.onclick = () => {
      saveCurrentOrder();  // 👈 สำคัญ!
      if (type === "food") currentFoodPage = i;
      else currentDrinkPage = i;
      renderMenu(type, i);
      loadCurrentOrder(); // 👈 โหลด order อีกครั้งหลังเปลี่ยนหน้า
    };
    
    pagination.appendChild(btn);
  });
}


renderMenu("food", currentFoodPage);
renderMenu("drink", currentDrinkPage);

// บันทึกออเดอร์ปัจจุบันไป localStorage ก่อนไปหน้าสรุป
function saveCurrentOrderToStorage() {
  saveCurrentOrder();
  // เก็บข้อมูลโต๊ะทั้งหมด พร้อมโต๊ะปัจจุบันใน localStorage
  localStorage.setItem("tableOrders", JSON.stringify(tableData));
  localStorage.setItem("currentTable", currentTable);
}

// โหลดออเดอร์ของโต๊ะแรกตอนโหลดหน้า
function saveDataToStorage() {
  saveCurrentOrder(); // บันทึก order ของโต๊ะปัจจุบันก่อน
  localStorage.setItem("tableOrders", JSON.stringify(tableData));
  localStorage.setItem("currentTable", currentTable);
}

function loadDataFromStorage() {
  const savedTableOrders = localStorage.getItem('tableOrders');
  const savedCurrentTable = localStorage.getItem('currentTable');

  if (savedTableOrders) {
    Object.assign(tableData, JSON.parse(savedTableOrders));
  }
  if (savedCurrentTable) {
    currentTable = parseInt(savedCurrentTable, 10);
  }

  loadCurrentOrder();
  document.getElementById("currentTableLabel").textContent = currentTable;
  populateMoveTableOptions();
}

loadDataFromStorage();
function moveOrderToTable(fromTable, toTable) {
  if (fromTable === toTable) {
    alert("โต๊ะต้นทางและปลายทางต้องไม่เหมือนกัน");
    return;
  }

  // ถ้ามีออเดอร์ที่โต๊ะต้นทาง
  if (tableData[fromTable]) {
    // ถ้ามีออเดอร์โต๊ะปลายทางอยู่แล้ว ให้รวมกัน
    if (!tableData[toTable]) {
      tableData[toTable] = {};
    }
    for (let item in tableData[fromTable]) {
      if (tableData[toTable][item]) {
        tableData[toTable][item].qty += tableData[fromTable][item].qty;
      } else {
        tableData[toTable][item] = { ...tableData[fromTable][item] };
      }
    }
    // ลบออเดอร์โต๊ะต้นทาง
    delete tableData[fromTable];

    // ถ้าโต๊ะต้นทางคือโต๊ะปัจจุบัน ให้เคลียร์ order ปัจจุบัน
    if (currentTable === fromTable) {
      order = {};
    }
  }

  // เปลี่ยนโต๊ะปัจจุบันเป็นโต๊ะปลายทาง และโหลดออเดอร์ใหม่
  currentTable = toTable;
  loadCurrentOrder();
  document.getElementById("currentTableLabel").textContent = currentTable;

  saveDataToStorage();
}
function populateMoveTableOptions() {
  const select = document.getElementById("moveToTableSelect");
  select.innerHTML = "";
  for (let i = 1; i <= 37; i++) {
    if (i !== currentTable) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `โต๊ะ ${i}`;
      select.appendChild(option);
    }
  }
}

function onMoveTable() {
  const select = document.getElementById("moveToTableSelect");
  const toTable = parseInt(select.value, 10);
  moveOrderToTable(currentTable, toTable);
  populateMoveTableOptions();  // อัปเดตตัวเลือกโต๊ะใหม่หลังย้าย
}

// เพิ่มเมนู
document.getElementById("addMenuForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const type = document.getElementById("addType").value;
  const pageValue = document.getElementById("addPage").value;
  const name = document.getElementById("addName").value.trim();
  const price = parseFloat(document.getElementById("addPrice").value);

  const page = parseInt(pageValue, 10) - 1; // ลด 1 เพื่อให้เป็น index 0-based


  if (!name || isNaN(price) || price < 0) {
    alert("กรุณากรอกชื่อและราคาที่ถูกต้อง");
    return;
  }

  if (!Number.isInteger(page) || page < 0) {
    alert("กรุณาระบุหมายเลขหน้าเป็นจำนวนเต็มบวก (1 ขึ้นไป)");
    return;
  }

  console.log("เพิ่มเมนูที่หน้า (index):", page);
  addMenuItem(type, page, name, price);
  this.reset();
});

// ลบเมนู
document.getElementById("removeMenuForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const type = document.getElementById("removeType").value;
  const pageValue = document.getElementById("removePage").value;
  const name = document.getElementById("removeName").value.trim();

  const page = parseInt(pageValue, 10) - 1; // ลด 1 ให้เป็น index 0-based

  if (!name) {
    alert("กรุณาระบุชื่อเมนูที่จะลบ");
    return;
  }
  if (!Number.isInteger(page) || page < 0) {
    alert("กรุณาระบุหมายเลขหน้าเป็นจำนวนเต็มบวก (1 ขึ้นไป)");
    return;
  }

  removeMenuItem(type, page, name);
  this.reset();
});


function addMenuItem(type, page, name, price) {
  if (!menuData[type]) {
    alert("ประเภทเมนูไม่ถูกต้อง");
    return;
  }

  
  // แก้ไข: สร้างหน้าใหม่เฉพาะเมื่อไม่มี
  if (!Array.isArray(menuData[type][page])) {
    menuData[type][page] = [];
  }

  const newItem = { name, price, image: "tom.jpg" };
  menuData[type][page].push(newItem);
  setPrice(newItem, price);

 // แก้ไข customMenuData ด้วย
 if (!customMenuData[type]) {
  customMenuData[type] = [];
}
if (!Array.isArray(customMenuData[type][page])) {
  customMenuData[type][page] = [];
}

customMenuData[type][page].push(newItem);
saveCustomMenuData();

console.log(`📌 เพิ่มเมนูที่หน้า (ใน addMenuItem): ${page}`);
console.log(`menuData[${type}].length ปัจจุบัน: ${menuData[type].length}`);
renderMenu(type, page);
}



function renderCustomItems() {
  const customContainer = document.getElementById("custom-menu-container"); // ตรวจสอบว่า ID ตรงกับ HTML
  if (!customContainer) {
    console.warn("ไม่พบ container สำหรับ custom menu");
    return;
  }

  const savedData = localStorage.getItem("customMenuData");
  if (!savedData) return;

  try {
    const parsedData = JSON.parse(savedData);

    customContainer.innerHTML = ""; // ล้างของเก่าก่อนแสดงใหม่

    for (const type in parsedData) {
      parsedData[type].forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "menu-item";
        itemDiv.innerHTML = `
          <p><strong>${item.name}</strong></p>
          <p>ราคา: ${item.price} บาท</p>
        `;
        customContainer.appendChild(itemDiv);
      });
    }
  } catch (e) {
    console.error("renderCustomItems() error:", e);
  }
}
function removeMenuItem(type, page, name) {
  const savedData = localStorage.getItem("customMenu");
  if (!savedData) return;

  const parsedData = JSON.parse(savedData);

  if (!parsedData[type] || !parsedData[type][page]) return;

  // ลบรายการตามชื่อ
  parsedData[type][page] = parsedData[type][page].filter(item => item.name !== name);

  // ถ้าหน้านั้นว่างแล้วให้ลบทิ้ง
  if (parsedData[type][page].length === 0) {
    parsedData[type].splice(page, 1);
  }

  // อัปเดตตัวแปรในหน่วยความจำ
  customMenuData = parsedData;

  // บันทึกกลับ
  saveCustomMenuData();

  // อัปเดตเมนูหลัก
  menuData[type][page] = menuData[type][page].filter(item => item.name !== name);

  renderMenu(type, page); // อัปเดตหน้าเมนู
  renderCustomItems();    // อัปเดตรายการที่แสดงอยู่
}

function saveCustomMenuData() {
  localStorage.setItem("customMenu", JSON.stringify(customMenuData));
}

// โหลด custom menu
function loadCustomMenuData() {
  const saved = localStorage.getItem("customMenu");
  if (saved) {
    const loaded = JSON.parse(saved);
    // Merge เข้า menuData
    for (let type in loaded) {
      if (!menuData[type]) menuData[type] = [];
      loaded[type].forEach((pageItems, pageIndex) => {
        if (!menuData[type][pageIndex]) {
          menuData[type][pageIndex] = pageItems;
        } else {
          menuData[type][pageIndex] = [
            ...menuData[type][pageIndex],
            ...pageItems,
          ];
        }
      });
    }
    customMenuData = loaded;
  }
}
let customMenuData = {
  food: [],
  drink: [],
};


