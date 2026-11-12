package com.example.data.models

data class DomainItem(
    val id: String,
    val name: String,
    val tld: String,
    val category: String,
    val price: Double,
    val originalPrice: Double,
    val description: String,
    val status: String = "available", // available, reserved, sold
    val isVerified: Boolean = true,
    val featured: Boolean = false
)

data class ApiItem(
    val id: String,
    val name: String,
    val category: String,
    val price: Double,
    val originalPrice: Double,
    val description: String,
    val features: List<String>,
    val endpoint: String = "/api/v1/resource",
    val sampleRequest: String = "{\n  \"action\": \"execute\"\n}"
)

data class BotItem(
    val id: String,
    val name: String,
    val category: String = "WhatsApp Bots",
    val price: Double,
    val originalPrice: Double,
    val description: String,
    val features: List<String>,
    val setupInstructions: String
)

data class OrderItem(
    val orderId: String,
    val username: String,
    val productType: String,
    val productName: String,
    val domainName: String = "",
    val amount: Double,
    val status: String, // pending, payment_submitted, verified, rejected, unlocked
    val createdAt: Long = System.currentTimeMillis(),
    val whatsappContact: String = "",
    val receiptFilename: String = "",
    val adminNotes: String = ""
)

data class UnlockedItem(
    val id: String,
    val itemType: String, // domain, api, bot
    val itemName: String,
    val domainName: String = "",
    val orderId: String,
    val unlockedAt: Long = System.currentTimeMillis(),
    val credentials: String = ""
)

data class BankDetails(
    val bankName: String = "Commercial Bank / Bank of Ceylon",
    val accountHolder: String = "DOMAIN SELL (PVT) LTD",
    val accountNumber: String = "801294819203",
    val branch: String = "Colombo City Super Grade",
    val currency: String = "LKR"
)

data class AdminStats(
    val totalRevenue: Double = 64200.0,
    val pendingPayments: Int = 2,
    val verifiedPayments: Int = 8,
    val unlockedProducts: Int = 7,
    val totalOrders: Int = 11
)
