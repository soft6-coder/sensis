package marketplace.sensis.app.nft;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NftRepository extends CrudRepository<Nft, Integer> {
	public Optional<Nft> findByToken(String token);
	public List<Nft> findByUserWalletAddressAndStatus(String walletAddress, String status);
}
