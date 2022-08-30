package marketplace.sensis.app.nft;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NftService {
	@Autowired
	private NftRepository nftRepository;
	
	public Nft addNft(Nft nft) {
		return nftRepository.save(nft);
	}
	
	public Optional<Nft> getNftByToken(String token) {
		return nftRepository.findByToken(token);
	}
	
	public List<Nft> getNftsByOwnerAndStatus(String walletAddress, String status) {
		return nftRepository.findByUserWalletAddressAndStatus(walletAddress, status);
	}
	
	public List<Nft> getNfts() {
		return (List<Nft>) nftRepository.findAll();
	}
	
}
