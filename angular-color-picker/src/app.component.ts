import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type Color = { hue: number; shade: number; hsl: string; hex: string };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './styles.css'
})
export class AppComponent {
  readonly lightness = [18, 26, 34, 42, 50, 58, 66, 76];
  readonly colors: Color[] = Array.from({ length: 16 }, (_, index) => index * 22.5)
    .flatMap((hue) => this.lightness.map((value, shade) => ({ hue, shade, hsl: `hsl(${hue}, 82%, ${value}%)`, hex: this.hslToHex(hue, 82, value) })));
  selected = this.colors[35];
  hexInput = this.selected.hex.slice(1);
  copied = false;

  get selectedRgb() { return this.hexToRgb(this.selected.hex); }
  get selectedHsl() { return `hsl(${Math.round(this.selected.hue)}, 82%, ${this.lightness[this.selected.shade]}%)`; }
  choose(color: Color) { this.selected = color; this.hexInput = color.hex.slice(1); this.copied = false; }
  applyHex() { const value = this.hexInput.trim().replace(/^#/, '').toLowerCase(); if (/^[0-9a-f]{6}$/.test(value)) this.selected = { ...this.selected, hex: `#${value}` }; else this.hexInput = this.selected.hex.slice(1); }
  async copyHex() { await navigator.clipboard.writeText(this.selected.hex); this.copied = true; setTimeout(() => this.copied = false, 1500); }
  private hslToHex(h: number, s: number, l: number) { s /= 100; l /= 100; const c = (1 - Math.abs(2 * l - 1)) * s; const x = c * (1 - Math.abs((h / 60 % 2) - 1)); const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x]; const m = l - c / 2; return `#${[r, g, b].map(v => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('')}`; }
  private hexToRgb(hex: string) { const n = Number.parseInt(hex.slice(1), 16); return { r: n >> 16 & 255, g: n >> 8 & 255, b: n & 255 }; }
}
