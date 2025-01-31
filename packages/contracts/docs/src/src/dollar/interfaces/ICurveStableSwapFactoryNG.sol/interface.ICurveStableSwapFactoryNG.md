# ICurveStableSwapFactoryNG
[Git Source](https://github.com/ubiquity/ubiquity-dollar/blob/92bc5664236b6ca4617eb576771a708a6060bc2e/src/dollar/interfaces/ICurveStableSwapFactoryNG.sol)

Factory allows the permissionless deployment of up to
eight-coin plain pools (ex: DAI-USDT-USDC) and metapools (ex: USDT-3CRV).
Liquidity pool and LP token share the same contract.


## Functions
### deploy_metapool

Deploys a stableswap NG metapool


```solidity
function deploy_metapool(
    address _base_pool,
    string memory _name,
    string memory _symbol,
    address _coin,
    uint256 _A,
    uint256 _fee,
    uint256 _offpeg_fee_multiplier,
    uint256 _ma_exp_time,
    uint256 _implementation_idx,
    uint8 _asset_type,
    bytes4 _method_id,
    address _oracle
) external returns (address);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_base_pool`|`address`|Address of the base pool to pair the token with. For tripool (DAI-USDT-USDC) use its pool address at 0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7.|
|`_name`|`string`|Name of the new metapool, ex: `Dollar/3CRV`|
|`_symbol`|`string`|Symbol for the new metapool’s LP token - will be concatenated with the base pool symbol, ex: `Dollar3CRV`|
|`_coin`|`address`|Address of the coin being used in the metapool, ex: use Dollar token address|
|`_A`|`uint256`|Amplification coefficient. If set to 0 then bonding curve acts like Uniswap. Any >0 value makes the bonding curve to swap at 1:1 constant price, the more `_A` the longer the constant price period. Curve recommends set it to 100 for crypto collateralizard stablecoins. This parameter can be updated later.|
|`_fee`|`uint256`|Trade fee, given as an integer with 1e10 precision, ex: 40000000 = 0.04% fee|
|`_offpeg_fee_multiplier`|`uint256`|Off-peg multiplier. Curve recommends set it to `20000000000`. This parameter can be updated later. More info: https://docs.curve.fi/stableswap-exchange/stableswap-ng/pools/overview/#dynamic-fees|
|`_ma_exp_time`|`uint256`|MA time; set as time_in_seconds / ln(2), ex: 866 = 600 seconds, 2597 = 1800 seconds. This parameter can be updated later.|
|`_implementation_idx`|`uint256`|Index of the metapool implementation to use. Can be retrieved via `ICurveStableSwapFactoryNG.metapool_implementations()`. There is only 1 metapool implementation right now so use index `0`.|
|`_asset_type`|`uint8`|Asset type of the pool as an integer. Available asset type indexes: - 0: Standard ERC20 token with no additional features - 1: Oracle - token with rate oracle (e.g. wstETH) - 2: Rebasing - token with rebase (e.g. stETH) - 3: ERC4626 - token with convertToAssets method (e.g. sDAI) Dollar is a standard ERC20 token so we should use asset type with index `0`.|
|`_method_id`|`bytes4`|First four bytes of the Keccak-256 hash of the function signatures of the oracle addresses that give rate oracles. This is applied only to asset type `1` (Oracle). For Dollar token deployment set empty.|
|`_oracle`|`address`|Rate oracle address. This is applied only to asset type `1` (Oracle). For Dollar token deployment set empty address.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|Deployed metapool address|


