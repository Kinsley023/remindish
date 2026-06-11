import os
from PIL import Image, ImageDraw

def process_logo():
    img_path = r"C:\Users\MSI-CYBORG\.gemini\antigravity\brain\0c5542c6-4c5f-404a-9d7f-e34622e1f345\media__1781198782893.png"
    out_dir = r"C:\Users\MSI-CYBORG\.gemini\antigravity\scratch\remindish-ai\images"
    os.makedirs(out_dir, exist_ok=True)

    # Load original image
    img = Image.open(img_path).convert("RGBA")
    width, height = img.size

    # 1. Generate version where only the corners outside the green circle are transparent
    # The circle fits nicely in the 296x292 dimension. Let's make a mask.
    mask = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(mask)
    # Define bounding box for the green circle (slightly inset to trim the outer cream area cleanly)
    padding = 2
    draw.ellipse([padding, padding, width - padding, height - padding], fill=255)
    
    img_circle = img.copy()
    img_circle.putalpha(mask)
    img_circle.save(os.path.join(out_dir, "logo_circle_transparent.png"), "PNG")
    print("Saved logo_circle_transparent.png")

    # 2. Generate version where all cream-like background colors are made fully transparent
    # We will iterate through pixels. Cream background is typically very bright, with high red and green, and low blue or slightly yellowish.
    # Let's inspect cream color. It is typically R > 240, G > 240, B > 220.
    img_full = img.copy()
    pixels = img_full.load()

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            # If the pixel is cream color (#fbf6e2 or similar white/cream background)
            # R is high, G is high, B is relatively high but slightly lower than R/G
            if r > 220 and g > 215 and b > 180:
                # Make it transparent
                pixels[x, y] = (r, g, b, 0)
            
            # Also apply the circular mask to ensure corners outside the circle are clean
            # Calculate distance from center (148, 146)
            dx = x - 148
            dy = y - 146
            if (dx*dx + dy*dy) > 143*143:
                pixels[x, y] = (r, g, b, 0)

    img_full.save(os.path.join(out_dir, "logo_fully_transparent.png"), "PNG")
    print("Saved logo_fully_transparent.png")

if __name__ == "__main__":
    process_logo()
