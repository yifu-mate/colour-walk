export interface ColorSwatch {
  hex: string;
  name: string;
  nameEn: string;
  family: string;
  mood: string;
}

const COLOR_DATABASE: ColorSwatch[] = [
  { hex: '#1A237E', name: '午夜靛', nameEn: 'Midnight Indigo', family: '蓝', mood: '深邃' },
  { hex: '#283593', name: '钴蓝', nameEn: 'Cobalt Blue', family: '蓝', mood: '沉稳' },
  { hex: '#303F9F', name: '皇家蓝', nameEn: 'Royal Blue', family: '蓝', mood: '高贵' },
  { hex: '#3949AB', name: '宝石蓝', nameEn: 'Sapphire Blue', family: '蓝', mood: '典雅' },
  { hex: '#3F51B5', name: '靛蓝', nameEn: 'Indigo', family: '蓝', mood: '沉思' },
  { hex: '#5C6BC0', name: '矢车菊蓝', nameEn: 'Cornflower Blue', family: '蓝', mood: '温柔' },
  { hex: '#7986CB', name: '薰衣草蓝', nameEn: 'Lavender Blue', family: '蓝', mood: '梦幻' },
  { hex: '#4A90D9', name: '天青蓝', nameEn: 'Azure Blue', family: '蓝', mood: '开阔' },
  { hex: '#64B5F6', name: '晴空蓝', nameEn: 'Sky Blue', family: '蓝', mood: '自由' },
  { hex: '#90CAF9', name: '冰蓝', nameEn: 'Ice Blue', family: '蓝', mood: '清透' },
  { hex: '#0D47A1', name: '深海蓝', nameEn: 'Deep Sea Blue', family: '蓝', mood: '神秘' },
  { hex: '#1565C0', name: '海蓝', nameEn: 'Ocean Blue', family: '蓝', mood: '辽阔' },
  { hex: '#1976D2', name: '道奇蓝', nameEn: 'Dodger Blue', family: '蓝', mood: '活力' },
  { hex: '#42A5F5', name: '湖蓝', nameEn: 'Lake Blue', family: '蓝', mood: '宁静' },
  { hex: '#BBDEFB', name: '雾蓝', nameEn: 'Mist Blue', family: '蓝', mood: '朦胧' },

  { hex: '#B71C1C', name: '酒红', nameEn: 'Burgundy', family: '红', mood: '浓烈' },
  { hex: '#C62828', name: '朱砂', nameEn: 'Cinnabar', family: '红', mood: '热烈' },
  { hex: '#D32F2F', name: '石榴红', nameEn: 'Pomegranate', family: '红', mood: '热情' },
  { hex: '#E53935', name: '胭脂红', nameEn: 'Carmine', family: '红', mood: '奔放' },
  { hex: '#EF5350', name: '珊瑚红', nameEn: 'Coral Red', family: '红', mood: '温暖' },
  { hex: '#E57373', name: '玫瑰粉', nameEn: 'Rose Pink', family: '红', mood: '柔美' },
  { hex: '#EF9A9A', name: '樱粉', nameEn: 'Sakura Pink', family: '红', mood: '浪漫' },
  { hex: '#FFCDD2', name: '蜜桃粉', nameEn: 'Peach Pink', family: '红', mood: '甜蜜' },
  { hex: '#F44336', name: '正红', nameEn: 'Vermilion', family: '红', mood: '力量' },
  { hex: '#FF5252', name: '火红', nameEn: 'Flame Red', family: '红', mood: '激情' },
  { hex: '#FF8A80', name: '鲑鱼粉', nameEn: 'Salmon Pink', family: '红', mood: '柔和' },

  { hex: '#1B5E20', name: '松柏绿', nameEn: 'Pine Green', family: '绿', mood: '沉稳' },
  { hex: '#2E7D32', name: '翡翠绿', nameEn: 'Emerald Green', family: '绿', mood: '生机' },
  { hex: '#388E3C', name: '苔绿', nameEn: 'Moss Green', family: '绿', mood: '自然' },
  { hex: '#43A047', name: '草绿', nameEn: 'Grass Green', family: '绿', mood: '活力' },
  { hex: '#4CAF50', name: '翠绿', nameEn: 'Jade Green', family: '绿', mood: '清新' },
  { hex: '#66BB6A', name: '薄荷绿', nameEn: 'Mint Green', family: '绿', mood: '清凉' },
  { hex: '#81C784', name: '嫩绿', nameEn: 'Spring Green', family: '绿', mood: '希望' },
  { hex: '#A5D6A7', name: '豆绿', nameEn: 'Pea Green', family: '绿', mood: '淡雅' },
  { hex: '#C8E6C9', name: '烟绿', nameEn: 'Smoke Green', family: '绿', mood: '朦胧' },
  { hex: '#00E676', name: '荧光绿', nameEn: 'Neon Green', family: '绿', mood: '前卫' },

  { hex: '#E65100', name: '焦橙', nameEn: 'Burnt Orange', family: '橙', mood: '热烈' },
  { hex: '#EF6C00', name: '蜜橙', nameEn: 'Honey Orange', family: '橙', mood: '温暖' },
  { hex: '#F57C00', name: '柿子橙', nameEn: 'Persimmon', family: '橙', mood: '丰收' },
  { hex: '#FB8C00', name: '琥珀橙', nameEn: 'Amber Orange', family: '橙', mood: '明亮' },
  { hex: '#FF9800', name: '落日橙', nameEn: 'Sunset Orange', family: '橙', mood: '浪漫' },
  { hex: '#FFA726', name: '杏橙', nameEn: 'Apricot Orange', family: '橙', mood: '柔和' },
  { hex: '#FFB74D', name: '沙橙', nameEn: 'Sand Orange', family: '橙', mood: '温暖' },
  { hex: '#FFCC80', name: '奶油橙', nameEn: 'Cream Orange', family: '橙', mood: '甜蜜' },
  { hex: '#FF8A65', name: '暮光橙', nameEn: 'Twilight Orange', family: '橙', mood: '温柔' },

  { hex: '#F57F17', name: '芥黄', nameEn: 'Mustard Yellow', family: '黄', mood: '独特' },
  { hex: '#F9A825', name: '琥珀黄', nameEn: 'Amber Yellow', family: '黄', mood: '温暖' },
  { hex: '#FBC02D', name: '向日葵黄', nameEn: 'Sunflower', family: '黄', mood: '阳光' },
  { hex: '#FDD835', name: '柠檬黄', nameEn: 'Lemon Yellow', family: '黄', mood: '明快' },
  { hex: '#FFEE58', name: '鹅黄', nameEn: 'Gosling Yellow', family: '黄', mood: '娇嫩' },
  { hex: '#FFF9C4', name: '米黄', nameEn: 'Cream Yellow', family: '黄', mood: '温馨' },
  { hex: '#FFD54F', name: '麦穗黄', nameEn: 'Wheat Yellow', family: '黄', mood: '丰收' },

  { hex: '#4A148C', name: '暗紫', nameEn: 'Dark Purple', family: '紫', mood: '神秘' },
  { hex: '#6A1B9A', name: '茄紫', nameEn: 'Eggplant Purple', family: '紫', mood: '深沉' },
  { hex: '#7B1FA2', name: '紫罗兰', nameEn: 'Violet', family: '紫', mood: '优雅' },
  { hex: '#8E24AA', name: '葡萄紫', nameEn: 'Grape Purple', family: '紫', mood: '醇厚' },
  { hex: '#9C27B0', name: '品红', nameEn: 'Magenta', family: '紫', mood: '华丽' },
  { hex: '#AB47BC', name: '兰花紫', nameEn: 'Orchid Purple', family: '紫', mood: '浪漫' },
  { hex: '#BA68C8', name: '丁香紫', nameEn: 'Lilac', family: '紫', mood: '梦幻' },
  { hex: '#CE93D8', name: '薰衣草', nameEn: 'Lavender', family: '紫', mood: '安宁' },
  { hex: '#E1BEE7', name: '藕荷色', nameEn: 'Lotus Root', family: '紫', mood: '素雅' },
  { hex: '#F06292', name: '洋红', nameEn: 'Fuchsia', family: '紫', mood: '热情' },

  { hex: '#004D40', name: '墨青', nameEn: 'Ink Cyan', family: '青', mood: '沉稳' },
  { hex: '#00695C', name: '松石绿', nameEn: 'Teal', family: '青', mood: '深邃' },
  { hex: '#00796B', name: '孔雀绿', nameEn: 'Peacock Green', family: '青', mood: '华贵' },
  { hex: '#00897B', name: '碧青', nameEn: 'Viridian', family: '青', mood: '清雅' },
  { hex: '#009688', name: '青瓷', nameEn: 'Celadon', family: '青', mood: '古朴' },
  { hex: '#26A69A', name: '水鸭青', nameEn: 'Teal Blue', family: '青', mood: '沉静' },
  { hex: '#4DB6AC', name: '薄荷青', nameEn: 'Mint Cyan', family: '青', mood: '清爽' },
  { hex: '#80CBC4', name: '冰川青', nameEn: 'Glacier Cyan', family: '青', mood: '通透' },
  { hex: '#B2DFDB', name: '烟青', nameEn: 'Smoke Cyan', family: '青', mood: '淡远' },

  { hex: '#212121', name: '墨色', nameEn: 'Ink Black', family: '灰', mood: '庄重' },
  { hex: '#424242', name: '炭灰', nameEn: 'Charcoal', family: '灰', mood: '沉稳' },
  { hex: '#616161', name: '铁灰', nameEn: 'Iron Gray', family: '灰', mood: '坚毅' },
  { hex: '#757575', name: '铅灰', nameEn: 'Lead Gray', family: '灰', mood: '内敛' },
  { hex: '#9E9E9E', name: '银灰', nameEn: 'Silver Gray', family: '灰', mood: '冷静' },
  { hex: '#BDBDBD', name: '雾灰', nameEn: 'Fog Gray', family: '灰', mood: '朦胧' },
  { hex: '#E0E0E0', name: '云灰', nameEn: 'Cloud Gray', family: '灰', mood: '轻盈' },
  { hex: '#EEEEEE', name: '月白', nameEn: 'Moon White', family: '灰', mood: '皎洁' },
  { hex: '#F5F5F5', name: '素白', nameEn: 'Pure White', family: '灰', mood: '纯净' },
  { hex: '#FAFAFA', name: '象牙白', nameEn: 'Ivory White', family: '灰', mood: '温润' },
];

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function findClosestColor(r: number, g: number, b: number): ColorSwatch {
  const inputHsl = rgbToHsl(r, g, b);

  let closestColor = COLOR_DATABASE[0];
  let minDistance = Infinity;

  for (const swatch of COLOR_DATABASE) {
    const rgb = hexToRgb(swatch.hex);
    const swatchHsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    let distance: number;

    if (inputHsl.s < 12) {
      if (swatchHsl.s > 20) {
        distance = 1000 + Math.abs(inputHsl.l - swatchHsl.l);
      } else {
        distance = Math.abs(inputHsl.l - swatchHsl.l);
      }
    } else {
      if (swatchHsl.s < 8) {
        distance = 1000;
      } else {
        let hueDiff = Math.abs(inputHsl.h - swatchHsl.h);
        if (hueDiff > 180) hueDiff = 360 - hueDiff;

        const hueWeight = 2.5;
        const satWeight = 0.8;
        const lightWeight = 0.4;

        distance = Math.sqrt(
          (hueDiff * hueWeight) ** 2 +
          ((inputHsl.s - swatchHsl.s) * satWeight) ** 2 +
          ((inputHsl.l - swatchHsl.l) * lightWeight) ** 2
        );
      }
    }

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = swatch;
    }
  }

  return closestColor;
}

export function getFamilyColors(family: string): ColorSwatch[] {
  return COLOR_DATABASE.filter(c => c.family === family);
}

export { COLOR_DATABASE };
