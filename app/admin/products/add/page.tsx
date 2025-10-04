"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Save, Image } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Account = { username: string; password: string };

type Variant = {
  name: string;
  price: number;
  quantity: number;
  accounts: Account[];
};

export default function ProductsPage() {
  const router = useRouter();

  // State untuk product info
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // State untuk variants
  const [variants, setVariants] = useState<Variant[]>([
    { name: "", price: 0, quantity: 0, accounts: [] },
  ]);

  const addVariant = () => {
    setVariants([
      ...variants,
      { name: "", price: 0, quantity: 0, accounts: [] },
    ]);
  };

  const handleVariantChange = (i: number, field: keyof Variant, value: any) => {
    const updated = [...variants];
    (updated[i] as any)[field] = value;

    if (field === "quantity") {
      const qty = Number(value) || 0;
      updated[i].accounts = Array.from({ length: qty }, (_, idx) => {
        return updated[i].accounts[idx] || { username: "", password: "" };
      });
    }

    setVariants(updated);
  };

  const handleAccountChange = (
    variantIndex: number,
    accountIndex: number,
    field: "username" | "password",
    value: string
  ) => {
    const updated = [...variants];
    updated[variantIndex].accounts[accountIndex][field] = value;
    setVariants(updated);
  };

  // 🚀 Simpan ke database
  const handleSave = async () => {
    const product = {
      name,
      image,
      description,
      category,
      variants,
    };

    console.log("Saving product:", product);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error("Failed to save product");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Add Product</h2>
        <Button className="flex items-center gap-2" onClick={handleSave}>
          <Save className="w-4 h-4" />
          Save Product
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form kiri */}
        <div className="lg:col-span-2 space-y-8">
          {/* Product Info */}
          <div className="bg-card p-6 rounded-xl shadow-sm space-y-6">
            <h3 className="text-xl font-bold">Product Info</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Product Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Netflix Premium"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Streaming, Game, Software"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Product Image URL</label>
                <Input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/image.png"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the product..."
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-card p-6 rounded-xl shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Product Variants</h3>
              <Button
                variant="outline"
                onClick={addVariant}
                className="flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Add Variant
              </Button>
            </div>

            <div className="space-y-6">
              {variants.map((variant, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 space-y-4 bg-muted/30"
                >
                  {/* Variant Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Variant Name</label>
                      <Input
                        value={variant.name}
                        onChange={(e) =>
                          handleVariantChange(i, "name", e.target.value)
                        }
                        placeholder="e.g. 1 Month Account"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Price</label>
                      <Input
                        type="number"
                        value={variant.price}
                        onChange={(e) =>
                          handleVariantChange(i, "price", Number(e.target.value))
                        }
                        placeholder="100000"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Quantity</label>
                      <Input
                        type="number"
                        value={variant.quantity}
                        onChange={(e) =>
                          handleVariantChange(
                            i,
                            "quantity",
                            Number(e.target.value)
                          )
                        }
                        placeholder="3"
                      />
                    </div>
                  </div>

                  {/* Accounts form */}
                  {variant.accounts.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">
                        Accounts ({variant.quantity})
                      </h4>
                      {variant.accounts.map((acc, accIndex) => (
                        <div
                          key={accIndex}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                          <Input
                            placeholder="Username / Email"
                            value={acc.username}
                            onChange={(e) =>
                              handleAccountChange(
                                i,
                                accIndex,
                                "username",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            placeholder="Password"
                            value={acc.password}
                            onChange={(e) =>
                              handleAccountChange(
                                i,
                                accIndex,
                                "password",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview kanan */}
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4">Preview</h3>
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed mb-4 overflow-hidden">
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Image className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
            <h4 className="font-bold">{name || "Product Name"}</h4>
            <p className="text-xs text-muted-foreground italic">
              {category || "No Category"}
            </p>
            <p className="text-sm text-muted-foreground">
              {description || "Example description product..."}
            </p>

            {/* Preview semua variant */}
            {variants && variants.length > 0 && (
              <div className="mt-4 space-y-2">
                {variants.map((v, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{v.name || "Variant Name"}</span>
                    <span>Rp {v.price?.toLocaleString() || 0}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
