// pro_plus.js
// Node.js/Express version of your pro_plus.py with only GET + PUT
// Requires: npm i express pg

const express = require("express");
const { Client } = require("pg");

// ---- Redshift connection ----
function connectToDevRedshift() {
  return new Client({
    host: "ace-common-cluster-1.csuh9tvc69yu.ap-south-1.redshift.amazonaws.com",
    database: "dev",
    port: 5439,
    user: "smartuser",
    password: "SMARTuser@12345",
    ssl: { rejectUnauthorized: false }
  });
}

const app = express();
app.use(express.json());

// ---- Helper: fetch one row by email ----
async function fetchRow(client, email) {
  const sel = await client.query(
    `
    SELECT email, plan, plan_status, counter_ai_report, counter_interactions, rejection_remark
    FROM smart_zone.tbl_subscription_management
    WHERE email = $1
    `,
    [email]
  );
  if (!sel.rows.length) return null;
  const r = sel.rows[0];
  return {
    email: r.email,
    plan: r.plan,
    plan_status: r.plan_status,
    counter_ai_report: Number(r.counter_ai_report || 0),
    counter_interactions: Number(r.counter_interactions || 0),
    rejection_remark: r.rejection_remark || ""
  };
}

// ---- GET /subscription ----
app.get("/subscription", async (req, res) => {
  const email = (req.query.email || "").toString().trim();
  if (!email) return res.status(422).json({ detail: "Query param 'email' is required" });

  const client = connectToDevRedshift();
  try {
    await client.connect();
    await client.query("BEGIN");

    // Insert if not exists (defaults kick in)
    await client.query(
      `
      INSERT INTO smart_zone.tbl_subscription_management (email)
      SELECT $1
      WHERE NOT EXISTS (
        SELECT 1 FROM smart_zone.tbl_subscription_management WHERE email = $1
      );
      `,
      [email]
    );

    // Fetch row
    const out = await client.query(
      `
      SELECT plan, plan_status, counter_ai_report, counter_interactions
      FROM smart_zone.tbl_subscription_management
      WHERE email = $1
      `,
      [email]
    );

    if (!out.rows.length) {
      await client.query("ROLLBACK");
      return res.status(500).json({ detail: "Row not found after insert/select." });
    }

    await client.query("COMMIT");
    const r = out.rows[0];
    return res.json({
      plan: r.plan,
      plan_status: r.plan_status,
      counter_ai_report: Number(r.counter_ai_report || 0),
      counter_interactions: Number(r.counter_interactions || 0)
    });
  } catch (err) {
    try { await client.query("ROLLBACK"); } catch {}
    return res.status(500).json({ detail: `Redshift error: ${err}` });
  } finally {
    await client.end();
  }
});

// ---- PUT /subscription-update ----
app.put("/subscription-update", async (req, res) => {
  const {
    email,
    plan,
    plan_status,
    counter_ai_report,
    counter_interactions,
    rejection_remark
  } = req.body || {};

  if (
    !email || !plan || !plan_status ||
    typeof counter_ai_report !== "number" ||
    typeof counter_interactions !== "number" ||
    rejection_remark === undefined
  ) {
    return res.status(422).json({
      detail:
        "Body must include email, plan, plan_status, counter_ai_report (number), counter_interactions (number), rejection_remark"
    });
  }

  const client = connectToDevRedshift();
  try {
    await client.connect();
    await client.query("BEGIN");

    const existing = await fetchRow(client, String(email));
    if (!existing) {
      await client.query("ROLLBACK");
      return res.status(404).json({ detail: "Email not found." });
    }

    // Update row
    await client.query(
      `
      UPDATE smart_zone.tbl_subscription_management
      SET
        plan = $1,
        plan_status = $2,
        counter_ai_report = $3,
        counter_interactions = $4,
        rejection_remark = $5
      WHERE email = $6
      `,
      [plan, plan_status, counter_ai_report, counter_interactions, rejection_remark, String(email)]
    );

    const updated = await fetchRow(client, String(email));
    if (!updated) {
      await client.query("ROLLBACK");
      return res.status(500).json({ detail: "Failed to fetch row after update." });
    }

    await client.query("COMMIT");
    return res.json(updated);
  } catch (err) {
    try { await client.query("ROLLBACK"); } catch {}
    return res.status(500).json({ detail: `Redshift error: ${err}` });
  } finally {
    await client.end();
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Subscription API running on http://localhost:${PORT}`);
});
 
