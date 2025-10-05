"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PlusCircle, Save, Image } from "lucide-react";

type Account = { username: string; password: string };
type Variant = { name: string; price: number; quantity: number; accounts: Account[] };

export default function ProductsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [variants, setVariants] = useState<Variant[]>([
    { name: "", price: 0, quantity: 0, accounts: [] },
  ]);

  const addVariant = () => setVariants([...variants, { name: "", price: 0, quantity: 0, accounts: [] }]);

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

  const handleSave = async () => {
    const product = { name, image, description, category, variants };
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
        <h2 className="text-3xl font-bold tracking-tight">Add Product</h2>
        <Button className="flex items-center gap-2" onClick={handleSave}>
          <Save className="w-4 h-4" />
          Save Product
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Product Info */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Product Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  label: "Product Name",
                  value: name,
                  setter: setName,
                  placeholder: "e.g. Netflix Premium",
                },
                {
                  label: "Category",
                  value: category,
                  setter: setCategory,
                  placeholder: "e.g. Streaming, Game, Software",
                },
                {
                  label: "Product Image URL",
                  value: image,
                  setter: setImage,
                  placeholder: "https://example.com/image.png",
                },
              ].map((field, i) => (
                <div key={i} className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    {field.label}
                  </Label>
                  <Input
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <Textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the product..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Variants */}
          <Card className="border shadow-sm">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">Product Variants</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={addVariant}
                className="flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" /> Add Variant
              </Button>
            </CardHeader>

            <CardContent className="space-y-6">
              {variants.map((variant, i) => (
                <div
                  key={i}
                  className="border border-muted-foreground/10 bg-muted/20 rounded-xl p-5 space-y-5"
                >
                  {/* Variant fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Variant Name</Label>
                      <Input
                        value={variant.name}
                        onChange={(e) =>
                          handleVariantChange(i, "name", e.target.value)
                        }
                        placeholder="e.g. 1 Month Account"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Price</Label>
                      <Input
                        type="number"
                        value={variant.price}
                        onChange={(e) =>
                          handleVariantChange(i, "price", Number(e.target.value))
                        }
                        placeholder="100000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Quantity</Label>
                      <Input
                        type="number"
                        value={variant.quantity}
                        onChange={(e) =>
                          handleVariantChange(i, "quantity", Number(e.target.value))
                        }
                        placeholder="3"
                      />
                    </div>
                  </div>

                  {/* Accounts */}
                  {variant.accounts.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground">
                        Accounts ({variant.quantity})
                      </h4>
                      {variant.accounts.map((acc, accIndex) => (
                        <div
                          key={accIndex}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">
                              Username / Email
                            </Label>
                            <Input
                              value={acc.username}
                              onChange={(e) =>
                                handleAccountChange(i, accIndex, "username", e.target.value)
                              }
                              placeholder="Username / Email"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Password</Label>
                            <Input
                              value={acc.password}
                              onChange={(e) =>
                                handleAccountChange(i, accIndex, "password", e.target.value)
                              }
                              placeholder="Password"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Preview */}
        <div className="space-y-6">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="aspect-square bg-muted rounded-xl flex items-center justify-center border-2 border-dashed overflow-hidden">
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="w-12 h-12 text-muted-foreground" />
                )}
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-lg">{name || "Product Name"}</h4>
                <p className="text-xs text-muted-foreground italic">
                  {category || "No Category"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {description || "Example description product..."}
                </p>
              </div>

              {variants.length > 0 && (
                <div className="pt-4 border-t space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    Variants
                  </h4>
                  {variants.map((v, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm border-b border-muted-foreground/10 pb-1"
                    >
                      <span>{v.name || "Variant Name"}</span>
                      <span>Rp {v.price?.toLocaleString() || 0}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
