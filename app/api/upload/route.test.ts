import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("@vercel/blob", () => ({
  put: vi.fn(),
}));

const { put } = await import("@vercel/blob");

function createMockFile(
  overrides: Partial<{ name: string; size: number; type: string }> = {}
): File {
  const { name = "test.jpg", size = 1024, type = "image/jpeg" } = overrides;
  const content = new Uint8Array(size);
  return new File([content], name, { type });
}

describe("POST /api/upload", () => {
  beforeEach(() => {
    vi.mocked(put).mockReset();
  });

  it("retorna 400 quando nenhum arquivo é enviado", async () => {
    const formData = new FormData();

    const request = new Request("http://localhost/api/upload", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Nenhum arquivo enviado");
    expect(put).not.toHaveBeenCalled();
  });

  it("retorna 400 quando arquivo é muito grande", async () => {
    const formData = new FormData();
    const largeFile = createMockFile({ size: 5 * 1024 * 1024 }); // 5MB
    formData.append("file", largeFile);

    const request = new Request("http://localhost/api/upload", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Arquivo muito grande. Máximo 4MB.");
    expect(put).not.toHaveBeenCalled();
  });

  it("retorna 400 quando tipo de arquivo é inválido", async () => {
    const formData = new FormData();
    const invalidFile = createMockFile({ type: "application/pdf" });
    formData.append("file", invalidFile);

    const request = new Request("http://localhost/api/upload", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Tipo inválido. Use JPEG, PNG, WebP ou GIF.");
    expect(put).not.toHaveBeenCalled();
  });

  it("retorna 200 com URL quando upload é bem-sucedido", async () => {
    const mockUrl = "https://xxx.public.blob.vercel-storage.com/test-abc123.jpg";
    vi.mocked(put).mockResolvedValue({
      url: mockUrl,
    } as Awaited<ReturnType<typeof put>>);

    const formData = new FormData();
    const file = createMockFile();
    formData.append("file", file);

    const request = new Request("http://localhost/api/upload", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.url).toBe(mockUrl);
    expect(put).toHaveBeenCalledWith(
      "test.jpg",
      expect.any(File),
      expect.objectContaining({
        access: "public",
        addRandomSuffix: true,
      })
    );
  });

  it("aceita tipos de imagem permitidos (jpeg, png, webp, gif)", async () => {
    const types = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    for (const type of types) {
      vi.mocked(put).mockResolvedValue({
        url: `https://example.com/${type}.jpg`,
      } as Awaited<ReturnType<typeof put>>);

      const formData = new FormData();
      const file = createMockFile({ type });
      formData.append("file", file);

      const request = new Request("http://localhost/api/upload", {
        method: "POST",
        body: formData,
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
    }
  });

  it("retorna 500 quando put lança erro", async () => {
    vi.mocked(put).mockRejectedValue(new Error("Blob error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const formData = new FormData();
    const file = createMockFile();
    formData.append("file", file);

    const request = new Request("http://localhost/api/upload", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe("Unexpected error");

    consoleSpy.mockRestore();
  });
});
