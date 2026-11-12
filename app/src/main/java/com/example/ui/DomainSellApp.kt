package com.example.ui

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.models.OrderItem
import com.example.data.repository.DomainSellRepository
import com.example.ui.components.NeonParticleBackground
import com.example.ui.screens.*
import com.example.ui.theme.*

sealed class Screen(val id: String, val title: String, val icon: ImageVector) {
    object Home : Screen("home", "Home", Icons.Default.Home)
    object Domains : Screen("domains", "Domains", Icons.Default.Language)
    object Apis : Screen("apis", "APIs", Icons.Default.Terminal)
    object Bots : Screen("bots", "Bots", Icons.Default.SmartToy)
    object Orders : Screen("orders", "Orders", Icons.Default.ShoppingBag)
    object Products : Screen("products", "My Products", Icons.Default.Shield)
    object BankPay : Screen("bank_pay", "Bank Pay", Icons.Default.CreditCard)
    object Admin : Screen("admin", "Admin", Icons.Default.AdminPanelSettings)
}

@Composable
fun DomainSellApp(repository: DomainSellRepository) {
    var currentScreen by remember { mutableStateOf<Screen>(Screen.Home) }

    // Checkout Order Dialog State
    var checkoutProduct by remember {
        mutableStateOf<Triple<String, String, Double>?>(null) // type, name, price
    }
    var checkoutDomainName by remember { mutableStateOf("") }
    var customerUsernameInput by remember { mutableStateOf("kasun_dev") }

    // Bank Payment Prefill State
    var prefillOrderId by remember { mutableStateOf("") }
    var prefillAmount by remember { mutableStateOf(0.0) }
    var prefillProductName by remember { mutableStateOf("") }
    var prefillDomainName by remember { mutableStateOf("") }

    // BackHandler to return to Home screen when navigating back
    BackHandler(enabled = currentScreen != Screen.Home) {
        currentScreen = Screen.Home
    }

    Box(modifier = Modifier.fillMaxSize()) {
        // Glowing Particle Canvas Background
        NeonParticleBackground()

        Scaffold(
            modifier = Modifier.fillMaxSize(),
            containerColor = Color.Transparent,
            bottomBar = {
                NavigationBar(
                    containerColor = DarkSurface.copy(alpha = 0.95f),
                    contentColor = Color.White,
                    tonalElevation = 8.dp,
                    windowInsets = WindowInsets.navigationBars,
                    modifier = Modifier.border(1.dp, GlassBorder)
                ) {
                    val navItems = listOf(
                        Screen.Home,
                        Screen.Domains,
                        Screen.Apis,
                        Screen.Bots,
                        Screen.Orders,
                        Screen.Products,
                        Screen.BankPay,
                        Screen.Admin
                    )

                    navItems.forEach { screen ->
                        val isSelected = currentScreen == screen
                        NavigationBarItem(
                            selected = isSelected,
                            onClick = { currentScreen = screen },
                            icon = {
                                Icon(
                                    imageVector = screen.icon,
                                    contentDescription = screen.title,
                                    tint = if (isSelected) NeonPinkAccent else TextSecondary,
                                    modifier = Modifier.size(20.dp)
                                )
                            },
                            label = {
                                Text(
                                    text = screen.title,
                                    fontSize = 9.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                    color = if (isSelected) Color.White else TextMuted
                                )
                            },
                            colors = NavigationBarItemDefaults.colors(
                                indicatorColor = NeonPurplePrimary.copy(alpha = 0.25f)
                            )
                        )
                    }
                }
            }
        ) { paddingValues ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
            ) {
                when (currentScreen) {
                    Screen.Home -> HomeScreen(
                        repository = repository,
                        onNavigate = { dest ->
                            when (dest) {
                                "domains" -> currentScreen = Screen.Domains
                                "apis" -> currentScreen = Screen.Apis
                                "bots" -> currentScreen = Screen.Bots
                                "orders" -> currentScreen = Screen.Orders
                                "products" -> currentScreen = Screen.Products
                                "bank_pay" -> currentScreen = Screen.BankPay
                                "admin" -> currentScreen = Screen.Admin
                            }
                        },
                        onBuyProduct = { type, name, domain, price ->
                            checkoutProduct = Triple(type, name, price)
                            checkoutDomainName = domain
                        }
                    )
                    Screen.Domains -> DomainsScreen(
                        repository = repository,
                        onBuyDomain = { dom ->
                            checkoutProduct = Triple("domain", dom.name, dom.price)
                            checkoutDomainName = dom.name
                        }
                    )
                    Screen.Apis -> ApisScreen(
                        repository = repository,
                        onBuyApi = { api ->
                            checkoutProduct = Triple("api", api.name, api.price)
                            checkoutDomainName = ""
                        }
                    )
                    Screen.Bots -> BotsScreen(
                        repository = repository,
                        onBuyBot = { bot ->
                            checkoutProduct = Triple("bot", bot.name, bot.price)
                            checkoutDomainName = ""
                        }
                    )
                    Screen.Orders -> MyOrdersScreen(
                        repository = repository,
                        onUploadSlip = { order ->
                            prefillOrderId = order.orderId
                            prefillAmount = order.amount
                            prefillProductName = order.productName
                            prefillDomainName = order.domainName
                            currentScreen = Screen.BankPay
                        }
                    )
                    Screen.Products -> MyProductsScreen(repository = repository)
                    Screen.BankPay -> BankPaymentScreen(
                        repository = repository,
                        initialOrderId = prefillOrderId,
                        initialAmount = prefillAmount,
                        initialProductName = prefillProductName,
                        initialDomainName = prefillDomainName
                    )
                    Screen.Admin -> AdminPortalScreen(repository = repository)
                }
            }
        }

        // Checkout Dialog
        if (checkoutProduct != null) {
            val (pType, pName, pPrice) = checkoutProduct!!

            AlertDialog(
                onDismissRequest = { checkoutProduct = null },
                confirmButton = {
                    Button(
                        onClick = {
                            val cleanUser = customerUsernameInput.trim().lowercase()
                            repository.setUsername(cleanUser)
                            val order = repository.placeOrder(pType, pName, checkoutDomainName, pPrice, cleanUser)
                            checkoutProduct = null

                            // Redirect to Bank Pay screen with generated order details
                            prefillOrderId = order.orderId
                            prefillAmount = order.amount
                            prefillProductName = order.productName
                            prefillDomainName = order.domainName
                            currentScreen = Screen.BankPay
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = NeonPurplePrimary)
                    ) {
                        Text("Place Bank Order", fontWeight = FontWeight.Bold)
                    }
                },
                dismissButton = {
                    TextButton(onClick = { checkoutProduct = null }) {
                        Text("Cancel", color = TextSecondary)
                    }
                },
                title = {
                    Text("Order Checkout", fontWeight = FontWeight.Bold, color = Color.White)
                },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text("Selected: $pName", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = NeonPurplePrimary)
                        Text("Amount: Rs. ${pPrice.toInt()}", fontWeight = FontWeight.Black, fontSize = 15.sp, color = NeonPinkAccent)

                        Spacer(modifier = Modifier.height(4.dp))
                        Text("Customer Username:", fontSize = 11.sp, color = TextSecondary)
                        OutlinedTextField(
                            value = customerUsernameInput,
                            onValueChange = { customerUsernameInput = it.lowercase().replace(" ", "_") },
                            placeholder = { Text("e.g. kasun_dev") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                        Text(
                            text = "Products will be unlocked directly to this username upon bank transfer approval.",
                            fontSize = 10.sp,
                            color = TextMuted
                        )
                    }
                },
                containerColor = DarkSurfaceElevated
            )
        }
    }
}
