import {
  getStakingTokenContract,
  getStakingContract,
  getCreditNftContract,
  getDollarMintCalculatorContract,
  getERC20Contract,
  getSushiSwapPoolContract,
  getTWAPOracleDollar3poolContract,
  getUbiquityDollarTokenContract,
  getUbiquityCreditTokenContract,
  getUbiquityFormulasContract,
  getUbiquityGovernanceTokenContract,
  getCreditNftRedemptionCalculatorContract,
  getCreditRedemptionCalculatorContract,
} from "@/components/utils/contracts";
import { getUniswapV2PairABIContract, getDollar3poolMarketContract } from "@/components/utils/contracts-external";

import { createContext, useContext, useEffect, useState } from "react";

import { UbiquityDollarManager } from "types/UbiquityDollarManager";

import { ChildrenShim } from "../children-shim";
import useWeb3, { PossibleProviders } from "../useWeb3";
import useDeployedContracts from "./useDeployedContracts";

export type ManagedContracts = Awaited<ReturnType<typeof connectManagerContracts>> | null;
export const ManagedContractsContext = createContext<ManagedContracts>(null);

export const ManagedContractsContextProvider: React.FC<ChildrenShim> = ({ children }) => {
  const [{ provider }] = useWeb3();
  const deployedContracts = useDeployedContracts();
  const [managedContracts, setManagedContracts] = useState<ManagedContracts>(null);

  useEffect(() => {
    if (deployedContracts && provider) {
      (async () => {
        setManagedContracts(await connectManagerContracts(deployedContracts.globalManager, provider));
      })();
    }
  }, [deployedContracts, provider]);

  return <ManagedContractsContext.Provider value={managedContracts}>{children}</ManagedContractsContext.Provider>;
};

async function connectManagerContracts(manager: UbiquityDollarManager["functions"], provider: NonNullable<PossibleProviders>) {
  // 4
  const [
    dollarToken,
    dollar3poolMarket,
    twapOracle,
    dollarMintCalculator,
    creditToken,
    governanceToken,
    _3crvToken,
    stakingToken,
    creditNft,
    staking,
    ubiquityChef,
    sushiSwapPool,
    ubiquityFormulas,
    creditNftCalculator,
    creditCalculator,
  ] = await Promise.all([
    manager.dollarTokenAddress(),
    manager.stableSwapMetaPoolAddress(),
    manager.twapOracleAddress(),
    manager.dollarMintCalculatorAddress(),
    manager.creditTokenAddress(),
    manager.governanceTokenAddress(),
    manager.curve3PoolTokenAddress(),
    manager.stakingAddress(),
    manager.creditNftAddress(),
    manager.stakingTokenAddress(),
    manager.masterChefAddress(),
    manager.sushiSwapPoolAddress(),
    manager.formulasAddress(),
    manager.creditNftCalculatorAddress(),
    manager.creditCalculatorAddress(),
  ]);

  const sushiSwapPoolContract = getSushiSwapPoolContract(sushiSwapPool, provider);
  const ugovUadPairContract = getUniswapV2PairABIContract(await sushiSwapPoolContract.pair(), provider);

  return {
    dollarToken: getUbiquityDollarTokenContract(dollarToken, provider),
    dollarMetapool: getDollar3poolMarketContract(dollar3poolMarket, provider),
    dollarTwapOracle: getTWAPOracleDollar3poolContract(twapOracle, provider),
    dollarMintCalculator: getDollarMintCalculatorContract(dollarMintCalculator, provider),
    creditToken: getUbiquityCreditTokenContract(creditToken, provider),
    governanceToken: getUbiquityGovernanceTokenContract(governanceToken, provider),
    _3crvToken: getERC20Contract(_3crvToken, provider),
    stakingToken: getStakingTokenContract(stakingToken, provider),
    creditNft: getCreditNftContract(creditNft, provider),
    staking: getStakingContract(staking, provider),
    masterChef: getStakingContract(ubiquityChef, provider),
    sushiSwapPool: sushiSwapPoolContract,
    governanceMarket: ugovUadPairContract,
    ubiquityFormulas: getUbiquityFormulasContract(ubiquityFormulas, provider),
    creditNftCalculator: getCreditNftRedemptionCalculatorContract(creditNftCalculator, provider),
    creditCalculator: getCreditRedemptionCalculatorContract(creditCalculator, provider),
  };
}

export default () => useContext(ManagedContractsContext);
