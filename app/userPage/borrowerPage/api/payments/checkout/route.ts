import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { amount } = await req.json();

  try {
    const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64"),
      },
      body: JSON.stringify({
        data: {
          attributes: {
            billing: { name: "Test User", email: "test@example.com" },
            amount: amount * 100, // PayMongo expects cents
            currency: "PHP",
            description: "Sample Payment",
            redirect: {
              success: "http://localhost:3000/success",
              failed: "http://localhost:3000/pay/failed",
            },
          },
        },
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
