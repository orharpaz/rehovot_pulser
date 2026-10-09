-- CreateIndex
CREATE INDEX "ClickEvent_campaignId_recipientId_idx" ON "ClickEvent"("campaignId", "recipientId");

-- AddForeignKey
ALTER TABLE "ClickEvent" ADD CONSTRAINT "ClickEvent_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Recipient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
