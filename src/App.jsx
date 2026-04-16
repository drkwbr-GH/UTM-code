import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Link as LinkIcon, RotateCcw } from "lucide-react";

function appendUtm(baseUrl: string, params: Record<string, string>) {
  if (!baseUrl) return "";
  try {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
    return url.toString();
  } catch {
    return "";
  }
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function DutchITUtmGenerator() {
  const [baseUrl, setBaseUrl] = useState("");
  const [campaign, setCampaign] = useState("dagelijks");
  const [contentName, setContentName] = useState("");
  const [includeCampaign, setIncludeCampaign] = useState(true);

  const autoContentFromUrl = useMemo(() => {
  try {
    const url = new URL(baseUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    const lastPart = parts[parts.length - 1] || "";
    return slugify(lastPart);
  } catch {
    return "";
  }
}, [baseUrl]);

const normalizedContent = useMemo(() => {
  if (contentName) return slugify(contentName);
  return autoContentFromUrl;
}, [contentName, autoContentFromUrl]);

  const linkedinUrl = useMemo(() => {
    const params: Record<string, string> = {
      utm_source: "linkedin",
      utm_medium: "social",
    };
    if (includeCampaign) params.utm_campaign = slugify(campaign || "dagelijks");
    if (normalizedContent) params.utm_content = normalizedContent;
    return appendUtm(baseUrl, params);
  }, [baseUrl, campaign, includeCampaign, normalizedContent]);

  const newsletterUrl = useMemo(() => {
    const params: Record<string, string> = {
      utm_source: "newsletter",
      utm_medium: "email",
    };
    if (includeCampaign) params.utm_campaign = slugify(campaign || "dagelijks");
    if (normalizedContent) params.utm_content = normalizedContent;
    return appendUtm(baseUrl, params);
  }, [baseUrl, campaign, includeCampaign, normalizedContent]);

  const websiteUrl = useMemo(() => {
  const params = {
    utm_source: "website",
    utm_medium: "referral",
  };
  if (includeCampaign) params.utm_campaign = slugify(campaign || "dagelijks");
  if (normalizedContent) params.utm_content = normalizedContent;
  return appendUtm(baseUrl, params);
}, [baseUrl, campaign, includeCampaign, normalizedContent]);

  const copyToClipboard = async (value: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // no-op
    }
  };
