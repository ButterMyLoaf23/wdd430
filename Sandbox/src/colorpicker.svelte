<script>
  const lightness = [18, 26, 34, 42, 50, 58, 66, 76];
  const hues = Array.from({ length: 16 }, (_, index) => index * 22.5);

  const colors = hues.flatMap((hue) =>
    lightness.map((value, shade) => ({
      hue,
      shade,
      hsl: `hsl(${hue}, 82%, ${value}%)`,
      hex: hslToHex(hue, 82, value)
    }))
  );

  let selected = colors[35];
  let hexInput = selected.hex.slice(1);
  let copied = false;

  $: selectedRgb = hexToRgb(selected.hex);
  $: selectedHsl = `hsl(${Math.round(selected.hue)}, 82%, ${lightness[selected.shade]}%)`;

  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const chroma = (1 - Math.abs(2 * l - 1)) * s;
    const segment = h / 60;
    const x = chroma * (1 - Math.abs((segment % 2) - 1));
    const [r1, g1, b1] =
      segment < 1 ? [chroma, x, 0] :
      segment < 2 ? [x, chroma, 0] :
      segment < 3 ? [0, chroma, x] :
      segment < 4 ? [0, x, chroma] :
      segment < 5 ? [x, 0, chroma] : [chroma, 0, x];
    const match = l - chroma / 2;
    return `#${[r1, g1, b1].map((channel) => Math.round((channel + match) * 255).toString(16).padStart(2, '0')).join('')}`;
  }

  function hexToRgb(hex) {
    const value = hex.replace('#', '');
    const number = Number.parseInt(value, 16);
    return {
      r: (number >> 16) & 255,
      g: (number >> 8) & 255,
      b: number & 255
    };
  }

  function choose(color) {
    selected = color;
    hexInput = color.hex.slice(1);
    copied = false;
  }

  function selectHex() {
    const normalized = hexInput.trim().replace(/^#/, '').toLowerCase();
    if (/^[0-9a-f]{6}$/.test(normalized)) {
      selected = { ...selected, hex: `#${normalized}` };
      copied = false;
    } else {
      hexInput = selected.hex.slice(1);
    }
  }

  async function copyHex() {
    await navigator.clipboard.writeText(selected.hex);
    copied = true;
    setTimeout(() => (copied = false), 1500);
  }
</script>

<svelte:head>
  <title>128 Color Picker</title>
  <meta name="description" content="Choose from 128 carefully arranged colors." />
</svelte:head>

<main class="page-shell">
  <section class="picker-card" aria-label="128 color picker">
    <div class="intro">
      <div class="eyebrow"><span class="eyebrow-dot"></span>Color studio</div>
      <h1>Find your <em>color.</em></h1>
      <p>Explore a curated palette of 128 vivid shades, then copy the exact value you need.</p>
    </div>

    <div class="workspace">
      <div class="palette-panel">
        <div class="panel-heading">
          <div>
            <h2>All colors</h2>
            <span>16 hues · 8 shades</span>
          </div>
          <span class="count-badge">128</span>
        </div>

        <div class="swatch-grid" role="list" aria-label="Available colors">
          {#each colors as color}
            <button
              class:selected={selected.hex === color.hex}
              class="swatch"
              style={`--swatch: ${color.hsl}`}
              aria-label={`Choose ${color.hex}`}
              aria-pressed={selected.hex === color.hex}
              on:click={() => choose(color)}
            >
              {#if selected.hex === color.hex}<span class="check">✓</span>{/if}
            </button>
          {/each}
        </div>

        <div class="legend"><span class="legend-line"></span>Click a swatch to select</div>
      </div>

      <aside class="details-panel">
        <div class="preview" style={`--selected: ${selected.hex}`}>
          <span>Selected color</span>
          <strong>{selected.hex}</strong>
        </div>

        <div class="details-content">
          <label class="field-label" for="hex-value">HEX value</label>
          <div class="hex-entry">
            <span>#</span>
            <input id="hex-value" bind:value={hexInput} maxlength="7" on:change={selectHex} on:keydown={(event) => event.key === 'Enter' && selectHex()} aria-label="HEX color value" />
            <button class="apply-button" on:click={selectHex}>Apply</button>
          </div>

          <div class="value-list">
            <div class="value-row"><span>RGB</span><code>{selectedRgb.r}, {selectedRgb.g}, {selectedRgb.b}</code></div>
            <div class="value-row"><span>HSL</span><code>{selectedHsl}</code></div>
          </div>

          <button class="copy-button" on:click={copyHex}>
            <span>{copied ? '✓' : '⧉'}</span>{copied ? 'Copied to clipboard' : 'Copy HEX value'}
          </button>
        </div>
      </aside>
    </div>
  </section>
</main>

<style>
  :global(*) { box-sizing: border-box; }
  :global(body) { margin: 0; background: #f5f6fa; color: #20222b; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  :global(button), :global(input) { font: inherit; }
  .page-shell { min-height: 100vh; padding: clamp(24px, 6vw, 78px) 20px; display: grid; place-items: center; background: radial-gradient(circle at 11% 12%, #fff 0, transparent 27%), radial-gradient(circle at 90% 88%, #e7e8ff 0, transparent 30%); }
  .picker-card { width: min(100%, 1080px); padding: clamp(28px, 5vw, 58px); border: 1px solid #e5e6ef; border-radius: 28px; background: rgba(255,255,255,.9); box-shadow: 0 25px 70px rgba(54, 52, 100, .1); }
  .intro { max-width: 570px; margin-bottom: 38px; }
  .eyebrow { display: flex; align-items: center; gap: 9px; margin-bottom: 17px; color: #6964dd; font-size: 11px; font-weight: 800; letter-spacing: .15em; text-transform: uppercase; }
  .eyebrow-dot { width: 8px; height: 8px; border-radius: 50%; background: #716be5; box-shadow: 0 0 0 5px #edecff; }
  h1 { margin: 0; font-size: clamp(38px, 6vw, 68px); line-height: .98; letter-spacing: -.06em; font-weight: 800; }
  h1 em { color: #716be5; font-style: normal; }
  .intro p { margin: 20px 0 0; color: #737687; font-size: 15px; line-height: 1.65; }
  .workspace { display: grid; grid-template-columns: minmax(0, 1.65fr) minmax(260px, .85fr); gap: 28px; }
  .palette-panel, .details-panel { border: 1px solid #e9e9f1; border-radius: 19px; background: #fff; }
  .palette-panel { padding: 23px; }
  .panel-heading { display: flex; align-items: center; justify-content: space-between; margin-bottom: 21px; }
  h2 { margin: 0 0 4px; font-size: 16px; letter-spacing: -.02em; }
  .panel-heading span { color: #9294a1; font-size: 11px; }
  .count-badge { padding: 7px 10px; border-radius: 9px; color: #716be5 !important; background: #f1f0ff; font-weight: 800; }
  .swatch-grid { display: grid; grid-template-columns: repeat(16, 1fr); gap: 7px; }
  .swatch { position: relative; aspect-ratio: 1; min-width: 0; padding: 0; border: 0; border-radius: 7px; cursor: pointer; background: var(--swatch); transition: transform .16s ease, box-shadow .16s ease; }
  .swatch:hover { z-index: 1; transform: scale(1.18); box-shadow: 0 4px 13px rgba(31, 31, 52, .25); }
  .swatch.selected { outline: 3px solid #fff; box-shadow: 0 0 0 3px #716be5; transform: scale(1.08); z-index: 2; }
  .check { color: #fff; font-size: 12px; font-weight: 900; text-shadow: 0 1px 3px rgba(0,0,0,.35); }
  .legend { display: flex; align-items: center; gap: 8px; margin-top: 22px; color: #a2a3ae; font-size: 11px; }
  .legend-line { width: 18px; height: 1px; background: #d6d6df; }
  .details-panel { overflow: hidden; }
  .preview { min-height: 180px; padding: 25px; display: flex; flex-direction: column; justify-content: space-between; color: #fff; background: var(--selected); }
  .preview span { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; opacity: .75; }
  .preview strong { font-size: 29px; letter-spacing: .06em; }
  .details-content { padding: 25px; }
  .field-label { display: block; margin-bottom: 9px; color: #898b9a; font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
  .hex-entry { display: flex; align-items: center; border: 1px solid #e5e5ed; border-radius: 10px; padding: 0 12px; color: #a7a8b5; font-weight: 700; }
  .hex-entry input { width: 100%; min-width: 0; padding: 12px 7px; border: 0; outline: 0; color: #30313b; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
  .apply-button { padding: 7px 9px; border: 0; border-radius: 6px; color: #716be5; background: #f1f0ff; font-size: 11px; font-weight: 800; cursor: pointer; }
  .value-list { margin: 22px 0; border-top: 1px solid #efeff4; }
  .value-row { display: flex; justify-content: space-between; gap: 10px; padding: 13px 0; border-bottom: 1px solid #efeff4; color: #9697a4; font-size: 12px; }
  .value-row code { color: #363741; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; }
  .copy-button { width: 100%; padding: 12px; border: 0; border-radius: 10px; color: #fff; background: #716be5; font-size: 12px; font-weight: 800; cursor: pointer; transition: background .2s ease, transform .2s ease; }
  .copy-button:hover { background: #5f59cf; transform: translateY(-1px); }
  .copy-button span { margin-right: 8px; font-size: 15px; }
  @media (max-width: 700px) { .workspace { grid-template-columns: 1fr; } .swatch-grid { gap: 5px; } .picker-card { border-radius: 20px; } }
  @media (max-width: 420px) { .swatch-grid { grid-template-columns: repeat(8, 1fr); } .swatch { aspect-ratio: 1.25; } }
</style>
