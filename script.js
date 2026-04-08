const charsetSelect = document.getElementById("charsetSelect");
const lengthSelect = document.getElementById("lengthSelect");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const passwordOutput = document.getElementById("passwordOutput");

const modal = document.getElementById("modal");
const modalMessage = document.getElementById("modalMessage");
const modalClose = document.getElementById("modalClose");

const CHAR_GROUPS = {
  number: "0123456789",
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  special: "!@#$%^&*()_+-=[]{}|;:,.<>?/~`"
};

const COMBINATIONS = {
  number: ["number"],
  lower: ["lower"],
  upper: ["upper"],
  special: ["special"],
  number_lower: ["number", "lower"],
  number_upper: ["number", "upper"],
  number_special: ["number", "special"],
  lower_upper: ["lower", "upper"],
  lower_special: ["lower", "special"],
  upper_special: ["upper", "special"],
  number_lower_upper: ["number", "lower", "upper"],
  number_lower_special: ["number", "lower", "special"],
  number_upper_special: ["number", "upper", "special"],
  lower_upper_special: ["lower", "upper", "special"],
  all: ["number", "lower", "upper", "special"]
};

function initLengthOptions() {
  for (let i = 4; i <= 20; i += 1) {
    const option = document.createElement("option");
    option.value = String(i);
    option.textContent = `${i}자리`;
    lengthSelect.appendChild(option);
  }
}

function showModal(message) {
  modalMessage.textContent = message;
  modal.classList.remove("hidden");
}

function hideModal() {
  modal.classList.add("hidden");
}

function getSecureRandomInt(max) {
  if (max <= 0) return 0;
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
}

function getRandomChar(pool) {
  return pool[getSecureRandomInt(pool.length)];
}

function shuffle(array) {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = getSecureRandomInt(i + 1);
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function generatePassword(selectedGroups, length) {
  const result = [];

  // 각 선택 그룹에서 최소 1개씩 포함
  selectedGroups.forEach((groupKey) => {
    result.push(getRandomChar(CHAR_GROUPS[groupKey]));
  });

  // 전체 문자 풀 구성
  const fullPool = selectedGroups.map((groupKey) => CHAR_GROUPS[groupKey]).join("");

  while (result.length < length) {
    result.push(getRandomChar(fullPool));
  }

  return shuffle(result).join("");
}

function validateSelections() {
  if (!charsetSelect.value || !lengthSelect.value) {
    showModal("문자열을 선택해 주세요");
    return false;
  }
  return true;
}

function handleGenerate() {
  if (!validateSelections()) return;

  const selectedKey = charsetSelect.value;
  const length = Number(lengthSelect.value);
  const selectedGroups = COMBINATIONS[selectedKey];

  if (!selectedGroups || selectedGroups.length > length) {
    showModal("문자열을 선택해 주세요");
    return;
  }

  const password = generatePassword(selectedGroups, length);
  passwordOutput.value = password;
}

async function handleCopy() {
  if (!passwordOutput.value) {
    showModal("먼저 비밀번호를 생성해 주세요");
    return;
  }

  try {
    await navigator.clipboard.writeText(passwordOutput.value);
    showModal("비밀번호가 복사되었습니다");
  } catch (error) {
    showModal("복사에 실패했습니다");
  }
}

function bindEvents() {
  generateBtn.addEventListener("click", handleGenerate);
  copyBtn.addEventListener("click", handleCopy);
  modalClose.addEventListener("click", hideModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) hideModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      hideModal();
    }
  });
}

function init() {
  initLengthOptions();
  bindEvents();
}

init();
