from PIL import Image
import os

def create_icons(input_image):
    # Define the sizes and filenames
    sizes = {
        "16": "icons/icon16.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
    }
    
    # Create the icons folder if it doesn't exist
    os.makedirs("icons", exist_ok=True)

    # Open the input image
    with Image.open(input_image) as img:
        for size, filename in sizes.items():
            # Resize the image
            resized_img = img.resize((int(size), int(size)), Image.Resampling.LANCZOS)
            # Save the resized image
            resized_img.save(filename, format="PNG")
            print(f"Created {filename}")

if __name__ == "__main__":
    input_image = input("Enter the path to the input image: ")
    create_icons(input_image)
