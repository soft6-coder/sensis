package marketplace.sensis.app.user;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {
	public Optional<User> findByWalletAddress(String walletAddress);
	public boolean existsByWalletAddress(String walletAddress);
	public void deleteByWalletAddress(String walletAddress);
}
