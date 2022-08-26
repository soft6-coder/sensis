package marketplace.sensis.app.nft;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NftRepository extends CrudRepository<Nft, Integer> {
	public Nft findByToken(String token);
}
