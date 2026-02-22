# 🌍 Aquanauts‑OceanTown — Core Simulation Equations Reference

  

This document is the **authoritative math specification** for the **Aquanauts‑OceanTown** simulation.

It defines **all equations**, written for **yearly time steps**, and provides **complete definitions of every variable**, including **all tuning parameters**.

  

All equations are designed to map directly to database‑stored 

`FunctionDefinition.ExpressionText` entries and to be evaluated by the simulation engine.

  

---

  

## 🧭 Notation Conventions

  

| Symbol         | Meaning                           |
| -------------- | --------------------------------- |
| $t$            | Current year (integer time index) |
| $t+1$          | Next year                         |
| Subscript $_t$ | Value at year $t$                 |
| Subscript $_0$ | Baseline or initial value         |


**Index variables** (e.g., happiness, ocean health, food sufficiency) are normalized to the range $[0,1]$ unless otherwise noted.

  

---

  

# 1️⃣ Population System

## 1. Population Update

  

$P_{t+1} = P_t + B_t - D_t + M_t$

| Symbol | Description            | Type               |
| ------ | ---------------------- | ------------------ |
| $P_t$  | Total population       | State              |
| $B_t$  | Births during year $t$ | Derived            |
| $D_t$  | Deaths during year $t$ | Derived            |
| $M_t$  | Net migration          | Derived (Optional) |

---
## 2. Births

$B_t = P_t \cdot b_t$

| Symbol | Description           | Type    |
| ------ | --------------------- | ------- |
| $b_t$  | Per‑capita birth rate | Derived |
| $P_t$  | Total population      | Above   |
___
## 3. Deaths
$D_t = P_t \cdot d_t$

| Symbol | Description | Type |
|------|------------|------|
| $d_t$ | Per‑capita death rate | Derived |
___
# 2️⃣ Carrying Capacity System
## 4. Land‑Based Carrying Capacity
$K^{land}_t = k_L \cdot SettlementLand_t$

| Symbol             | Description                               | Type       |
| ------------------ | ----------------------------------------- | ---------- |
| $SettlementLand_t$ | Land allocated to housing and settlements | State      |
| $k_L$              | People supported per unit land            | **Tuning** |
___

## 5. Food‑Based Carrying Capacity

$K^{food}_t = k_F \cdot FoodCapacity_t$

| Symbol | Description | Type |
|------|------------|------|
| $FoodCapacity_t$ | Total food production capacity | State |
| $k_F$ | People supported per unit food | **Tuning** |
___
## 6. Jobs‑Based Carrying Capacity

$K^{jobs}_t = k_J \cdot JobCapacity_t$

| Symbol | Description | Type |
|------|------------|------|
| $JobCapacity_t$ | Available employment slots | State |
| $k_J$ | People supported per job | **Tuning** |
___
## 7. Effective Carrying Capacity

$$K_t =

\min\!\left(K^{land}_t,\;K^{food}_t,\;K^{jobs}_t\right)

\cdot \left(1 + \beta_W (W_t - 0.5)\right)$$

| Symbol    | Description                               | Type       |
| --------- | ----------------------------------------- | ---------- |
| $K_t$     | Effective carrying capacity               | Derived    |
| $W_t$     | Population happiness / well‑being         | State      |
| $\beta_W$ | Happiness elasticity of carrying capacity | **Tuning** |
___

# 3️⃣ Birth Rate Model
## 8. Birth Rate
$$b_t =

b_0

\cdot \left(1 - \gamma \frac{P_t}{K_t}\right)

\cdot (0.5 + 0.5F_t)

\cdot (0.5 + 0.5W_t)

\cdot h(Dev_t)
$$

| Symbol     | Description                     | Type       |
| ---------- | ------------------------------- | ---------- |
| $b_0$      | Baseline birth rate             | **Tuning** |
| $\gamma$   | Density‑dependence strength     | **Tuning** |
| $F_t$      | Food sufficiency index          | State      |
| $W_t$      | Happiness index                 | State      |
| $Dev_t$    | Development index               | State      |
| $h(Dev_t)$ | Demographic transition modifier | Function   |
___
## 9. Demographic Transition Function
$$
h(Dev) = \frac{1}{1 + e^{s(Dev - \tau)}}
$$

| Symbol | Description | Type |
|------|------------|------|
| $s$ | Transition steepness | **Tuning** |
| $\tau$ | Development midpoint | **Tuning** |
___
# 4️⃣ Death Rate Model
## 10. Death Rate
$$
d_t =

d_0

\cdot (1 + \delta_{food}(1 - F_t))

\cdot (1 + \delta_{env}(1 - E_t))

\cdot (1 + \delta_{pol} \cdot Pollution_t)

\cdot (1 + \delta_O(1 - O_t))
$$


| Symbol          | Description                      | Type       |
| --------------- | -------------------------------- | ---------- |
| $d_0$           | Baseline death rate              | **Tuning** |
| $\delta_{food}$ | Sensitivity to food scarcity     | **Tuning** |
| $\delta_{env}$  | Sensitivity to land degradation  | **Tuning** |
| $\delta_{pol}$  | Sensitivity to pollution         | **Tuning** |
| $\delta_O$      | Sensitivity to ocean decline     | **Tuning** |
| $E_t$           | Terrestrial environmental health | State      |
| $O_t$           | Ocean health                     | State      |
| $Pollution_t$   | Aggregate pollution level        | State      |
___
# 5️⃣ Ocean System
## 11. Ocean Health Update
$$
O_{t+1} =

\text{clip}_{[0,1]}\Big(

O_t

+ r_O O_t(1 - O_t)

- \alpha_C \cdot OilUse_t(1 - O_t)

- \alpha_R \cdot Deforestation_t

- \alpha_P \cdot OilProduction_t

\Big)
$$

| Symbol            | Description                        | Type       |
| ----------------- | ---------------------------------- | ---------- |
| $O_t$             | Ocean health index                 | State      |
| $r_O$             | Ocean recovery rate                | **Tuning** |
| $\alpha_C$        | Carbon damage intensity            | **Tuning** |
| $\alpha_R$        | Runoff / sediment damage intensity | **Tuning** |
| $\alpha_P$        | Oil pollution damage intensity     | **Tuning** |
| $OilUse_t$        | Fossil fuel consumption            | State      |
| $Deforestation_t$ | Forest loss rate                   | State      |
| $OilProduction_t$ | Oil extraction rate                | State      |
___
# 6️⃣ Carbon & Food Coupling
## 12. CO₂ Absorbed by Ocean
$CO2Absorbed_t = \eta \cdot O_t \cdot CO2Emissions_t$

| Symbol | Description | Type |
|------|------------|------|
| $\eta$ | Ocean carbon uptake efficiency | **Tuning** |
| $CO2Emissions_t$ | Total CO₂ emissions | State |
___
## 13. Food Availability
$$
F_t = F^{land}_t + \omega \cdot O_t
$$
  
| Symbol | Description | Type |
|------|------------|------|
| $F_t$ | Total food sufficiency index | Derived |
| $F^{land}_t$ | Land‑based food contribution | State |
| $\omega$ | Ocean contribution to food | **Tuning** |
___
# 7️⃣ Happiness Dynamics
## 14. Happiness Update

$W_{t+1} = W_t - \lambda_O(1 - O_t)$

| Symbol | Description | Type |
|------|------------|------|
| $W_t$ | Population happiness | State |
| $\lambda_O$ | Happiness sensitivity to ocean damage | **Tuning** |
___
# 8️⃣ Migration (Optional)
## 15. Net Migration
$$
M_t = m_{max} \cdot (W_t - 0.5) \cdot J_t
$$

| Symbol    | Description            | Type       |
| --------- | ---------------------- | ---------- |
| $m_{max}$ | Maximum migration rate | **Tuning** |
| $J_t$     | Job availability index | State      |
___
## ✅ Summary
- **State variables** persist across years 

- **Derived variables** are computed by functions 

- **Tuning parameters** control strength, sensitivity, and timescales 

- All equations are compatible with database‑driven function evaluation 
This document is the **single source of truth** for Aquanauts‑OceanTown simulation mathematics.